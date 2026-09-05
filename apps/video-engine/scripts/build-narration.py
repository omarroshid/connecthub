"""Generate narration audio + a caption timeline from a script.json file.

Synthesizes each line separately so its exact duration is known (needed for
precise caption/bullet timing), then concatenates the lines (with silence
gaps) into one narration track and writes a timeline.json Remotion reads to
time everything to the audio.

Two voice backends:
- espeak (default) — fully local, no network. Standard calibrated profile in
  docs/video-production/VOICE_PROFILE.md. Override with --voice/--pitch.
- fish — Fish Audio's cloud TTS API using a cloned voice model (--fish-voice-id).
  Needs network access to api.fish.audio (blocked in some sandboxes) and an
  API key. NEVER pass the key on the command line or hardcode it in this
  file — set it as the FISH_AUDIO_API_KEY environment variable instead, e.g.:
      export FISH_AUDIO_API_KEY="sk-..."
      python3 scripts/build-narration.py --composition PodiaReview \\
          --voice-backend fish --fish-voice-id <your-model-id>

Usage (from apps/video-engine):
    python3 scripts/build-narration.py --composition SalesvueReview
    python3 scripts/build-narration.py --composition WordtuneReview --speed 160
"""

import argparse
import json
import os
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Standard brand voice — see docs/video-production/VOICE_PROFILE.md
DEFAULT_VOICE = "en-us"
DEFAULT_PITCH = 62  # espeak -p (0-99, default 50); calibrated to ~114Hz median F0
DEFAULT_SPEED_WPM = 165
DEFAULT_AMPLITUDE = 170
SAMPLE_RATE = 22050

FISH_TTS_URL = "https://api.fish.audio/v1/tts"


def synth_line_espeak(text: str, out_path: Path, voice: str, speed: int, pitch: int, amplitude: int) -> None:
    subprocess.run(
        [
            "espeak-ng", "-v", voice, "-s", str(speed), "-p", str(pitch),
            "-a", str(amplitude), "-w", str(out_path), text,
        ],
        check=True,
        capture_output=True,
    )


def synth_line_fish(text: str, out_path: Path, api_key: str, voice_id: str, model: str | None) -> None:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    if model:
        headers["model"] = model
    body = json.dumps({
        "text": text,
        "reference_id": voice_id,
        "format": "mp3",
        "mp3_bitrate": 128,
    }).encode("utf-8")
    req = urllib.request.Request(FISH_TTS_URL, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            audio_bytes = resp.read()
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Fish Audio API error {e.code} for line {text!r}: {err_body}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"Could not reach Fish Audio API ({FISH_TTS_URL}): {e.reason}") from e

    tmp_mp3 = out_path.with_suffix(".fish-raw.mp3")
    tmp_mp3.write_bytes(audio_bytes)
    # Standardize to mono wav at SAMPLE_RATE so every downstream step (gap
    # concat, ffprobe duration) works identically regardless of backend.
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(tmp_mp3), "-ac", "1", "-ar", str(SAMPLE_RATE), str(out_path)],
        check=True, capture_output=True,
    )
    tmp_mp3.unlink()


def make_silence(duration: float, out_path: Path) -> None:
    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", f"anullsrc=r={SAMPLE_RATE}:cl=mono",
            "-t", f"{duration:.3f}", str(out_path),
        ],
        check=True,
        capture_output=True,
    )


def get_duration(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(result.stdout.strip())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--composition", required=True, help="Composition folder name under src/, e.g. SalesvueReview")
    parser.add_argument("--script", default=None, help="Path to script.json (default: public/audio/<composition-lower>/script.json)")
    parser.add_argument("--voice-backend", choices=["espeak", "fish"], default="espeak", help="TTS engine (default: espeak, fully local)")

    espeak_group = parser.add_argument_group("espeak backend")
    espeak_group.add_argument("--voice", default=DEFAULT_VOICE, help=f"espeak-ng voice (default: {DEFAULT_VOICE})")
    espeak_group.add_argument("--pitch", type=int, default=DEFAULT_PITCH, help=f"espeak-ng pitch 0-99 (default: {DEFAULT_PITCH})")
    espeak_group.add_argument("--speed", type=int, default=DEFAULT_SPEED_WPM, help=f"espeak-ng words/min, tune to hit target runtime (default: {DEFAULT_SPEED_WPM})")
    espeak_group.add_argument("--amplitude", type=int, default=DEFAULT_AMPLITUDE, help=f"espeak-ng amplitude 0-200 (default: {DEFAULT_AMPLITUDE})")

    fish_group = parser.add_argument_group("fish backend")
    fish_group.add_argument("--fish-api-key", default=os.environ.get("FISH_AUDIO_API_KEY"), help="Fish Audio API key (default: $FISH_AUDIO_API_KEY env var — never pass this on the command line in a shared shell)")
    fish_group.add_argument("--fish-voice-id", default=os.environ.get("FISH_AUDIO_VOICE_ID"), help="Fish Audio voice/reference model id (default: $FISH_AUDIO_VOICE_ID env var)")
    fish_group.add_argument("--fish-model", default=None, help="Optional Fish Audio 'model' header (e.g. a specific TTS model version); omitted = account default")

    args = parser.parse_args()

    if args.voice_backend == "fish":
        if not args.fish_api_key:
            parser.error("--voice-backend fish requires --fish-api-key or $FISH_AUDIO_API_KEY")
        if not args.fish_voice_id:
            parser.error("--voice-backend fish requires --fish-voice-id or $FISH_AUDIO_VOICE_ID")

    slug = args.composition.lower()
    audio_dir = ROOT / "public" / "audio" / slug
    lines_dir = audio_dir / "lines"
    script_path = Path(args.script) if args.script else audio_dir / "script.json"
    timeline_out = ROOT / "src" / args.composition / "timeline.json"

    lines_dir.mkdir(parents=True, exist_ok=True)
    script = json.loads(script_path.read_text())

    concat_parts = []
    timeline = []
    cursor = 0.0

    for i, line in enumerate(script):
        speech_path = lines_dir / f"line-{i:02d}.wav"
        if args.voice_backend == "fish":
            synth_line_fish(line["text"], speech_path, args.fish_api_key, args.fish_voice_id, args.fish_model)
        else:
            synth_line_espeak(line["text"], speech_path, args.voice, args.speed, args.pitch, args.amplitude)
        dur = get_duration(speech_path)

        timeline.append({
            "section": line["section"],
            "bullet": line.get("bullet"),
            "label": line.get("label"),
            "keyword": line.get("keyword"),
            "text": line["text"],
            "start": round(cursor, 3),
            "end": round(cursor + dur, 3),
        })
        concat_parts.append(speech_path)
        cursor += dur

        gap = line.get("gapAfter", 0.15)
        if gap > 0:
            gap_path = lines_dir / f"gap-{i:02d}.wav"
            make_silence(gap, gap_path)
            concat_parts.append(gap_path)
            cursor += gap

    list_file = lines_dir / "concat_list.txt"
    list_file.write_text("\n".join(f"file '{p.resolve()}'" for p in concat_parts))

    narration_wav = audio_dir / "narration.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
         "-c", "copy", str(narration_wav)],
        check=True, capture_output=True,
    )

    narration_mp3 = audio_dir / "narration.mp3"
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(narration_wav), "-codec:a", "libmp3lame",
         "-qscale:a", "2", str(narration_mp3)],
        check=True, capture_output=True,
    )

    timeline_out.parent.mkdir(parents=True, exist_ok=True)
    timeline_out.write_text(json.dumps({
        "totalDuration": round(cursor, 3),
        "lines": timeline,
    }, indent=2))

    print(f"Voice backend: {args.voice_backend}")
    print(f"Total narration duration: {cursor:.2f}s")
    print(f"Wrote {narration_mp3} and {timeline_out}")


if __name__ == "__main__":
    main()
