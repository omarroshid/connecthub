"""Generate narration audio + a caption timeline from a script.json file.

Synthesizes each line separately with eSpeak NG so its exact duration is known
(no network / ML model needed), then concatenates the lines (with silence gaps)
into one narration track and writes a timeline.json Remotion reads to time
captions and section changes precisely to the audio.

Voice defaults to the standard calibrated profile in
docs/video-production/VOICE_PROFILE.md (matched to the user-provided
reference voiceover). Override with --voice/--pitch for a different video.

Usage (from apps/video-engine):
    python3 scripts/build-narration.py --composition SalesvueReview
    python3 scripts/build-narration.py --composition WordtuneReview --speed 160
"""

import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Standard brand voice — see docs/video-production/VOICE_PROFILE.md
DEFAULT_VOICE = "en-us"
DEFAULT_PITCH = 62  # espeak -p (0-99, default 50); calibrated to ~114Hz median F0
DEFAULT_SPEED_WPM = 165
DEFAULT_AMPLITUDE = 170
SAMPLE_RATE = 22050


def synth_line(text: str, out_path: Path, voice: str, speed: int, pitch: int, amplitude: int) -> None:
    subprocess.run(
        [
            "espeak-ng", "-v", voice, "-s", str(speed), "-p", str(pitch),
            "-a", str(amplitude), "-w", str(out_path), text,
        ],
        check=True,
        capture_output=True,
    )


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
    parser.add_argument("--voice", default=DEFAULT_VOICE, help=f"espeak-ng voice (default: {DEFAULT_VOICE})")
    parser.add_argument("--pitch", type=int, default=DEFAULT_PITCH, help=f"espeak-ng pitch 0-99 (default: {DEFAULT_PITCH})")
    parser.add_argument("--speed", type=int, default=DEFAULT_SPEED_WPM, help=f"espeak-ng words/min, tune to hit target runtime (default: {DEFAULT_SPEED_WPM})")
    parser.add_argument("--amplitude", type=int, default=DEFAULT_AMPLITUDE, help=f"espeak-ng amplitude 0-200 (default: {DEFAULT_AMPLITUDE})")
    args = parser.parse_args()

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
        synth_line(line["text"], speech_path, args.voice, args.speed, args.pitch, args.amplitude)
        dur = get_duration(speech_path)

        timeline.append({
            "section": line["section"],
            "bullet": line.get("bullet"),
            "label": line.get("label"),
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

    print(f"Total narration duration: {cursor:.2f}s")
    print(f"Wrote {narration_mp3} and {timeline_out}")


if __name__ == "__main__":
    main()
