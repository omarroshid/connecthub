"""Generate narration audio + a caption timeline from public/audio/script.json.

Synthesizes each line separately with eSpeak NG so its exact duration is known
(no network / ML model needed), then concatenates the lines (with silence gaps)
into one narration track and writes a timeline.json Remotion reads to time
captions and section changes precisely to the audio.
"""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
LINES_DIR = AUDIO_DIR / "lines"
TIMELINE_OUT = ROOT / "src" / "SalesvueReview" / "timeline.json"
SPEED_WPM = 172
SAMPLE_RATE = 22050


def synth_line(text: str, out_path: Path) -> None:
    subprocess.run(
        ["espeak-ng", "-v", "en-us", "-s", str(SPEED_WPM), "-a", "170", "-w", str(out_path), text],
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
    LINES_DIR.mkdir(parents=True, exist_ok=True)
    script = json.loads((AUDIO_DIR / "script.json").read_text())

    concat_parts = []
    timeline = []
    cursor = 0.0

    for i, line in enumerate(script):
        speech_path = LINES_DIR / f"line-{i:02d}.wav"
        synth_line(line["text"], speech_path)
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
            gap_path = LINES_DIR / f"gap-{i:02d}.wav"
            make_silence(gap, gap_path)
            concat_parts.append(gap_path)
            cursor += gap

    list_file = LINES_DIR / "concat_list.txt"
    list_file.write_text("\n".join(f"file '{p.resolve()}'" for p in concat_parts))

    narration_wav = AUDIO_DIR / "narration.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
         "-c", "copy", str(narration_wav)],
        check=True, capture_output=True,
    )

    narration_mp3 = AUDIO_DIR / "narration.mp3"
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(narration_wav), "-codec:a", "libmp3lame",
         "-qscale:a", "2", str(narration_mp3)],
        check=True, capture_output=True,
    )

    TIMELINE_OUT.parent.mkdir(parents=True, exist_ok=True)
    TIMELINE_OUT.write_text(json.dumps({
        "totalDuration": round(cursor, 3),
        "lines": timeline,
    }, indent=2))

    print(f"Total narration duration: {cursor:.2f}s")
    print(f"Wrote {narration_mp3} and {TIMELINE_OUT}")


if __name__ == "__main__":
    main()
