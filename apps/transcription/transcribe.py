"""Transcribe an audio file with WhisperX and print word-level timestamps.

Usage:
    .venv/bin/python transcribe.py sample_audio/sample.wav
"""

import argparse
import json

import whisperx


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio_path", help="Path to the audio file to transcribe")
    parser.add_argument("--model", default="tiny", help="Whisper model size (tiny/base/small/medium/large-v2)")
    parser.add_argument("--device", default="cpu", help="cpu or cuda")
    parser.add_argument("--out", default="transcript.json", help="Where to save the full word-level JSON")
    args = parser.parse_args()

    # compute_type "int8" keeps CPU inference fast and low-memory.
    compute_type = "int8" if args.device == "cpu" else "float16"

    print(f"Loading Whisper model '{args.model}' on {args.device}...")
    model = whisperx.load_model(args.model, args.device, compute_type=compute_type)

    print(f"Loading audio: {args.audio_path}")
    audio = whisperx.load_audio(args.audio_path)

    print("Transcribing...")
    result = model.transcribe(audio, batch_size=8)
    language = result["language"]
    print(f"Detected language: {language}")

    print("Aligning words to get precise word-level timestamps...")
    align_model, align_metadata = whisperx.load_align_model(language_code=language, device=args.device)
    result = whisperx.align(result["segments"], align_model, align_metadata, audio, args.device)

    print("\n=== Word-level timestamps ===")
    for segment in result["segments"]:
        for word in segment.get("words", []):
            start = word.get("start")
            end = word.get("end")
            text = word.get("word")
            if start is None or end is None:
                print(f"{text!r:20} (no timestamp - low confidence)")
            else:
                print(f"{start:7.2f}s -> {end:7.2f}s   {text}")

    with open(args.out, "w") as f:
        json.dump(result, f, indent=2)
    print(f"\nFull result saved to {args.out}")


if __name__ == "__main__":
    main()
