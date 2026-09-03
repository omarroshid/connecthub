# Transcription (WhisperX)

Speech-to-text with word-level timestamps, powered by [WhisperX](https://github.com/m-bain/whisperX).
This is the "hearing" half of the AI video-editing engine — it tells you exactly
when each word was spoken, which `apps/video-engine` (Remotion) can later use to
auto-generate captions, cut silence, or sync animations to speech.

## Setup

```sh
cd apps/transcription
python3 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
```

You also need `ffmpeg` installed on your system (`apt install ffmpeg` / `brew install ffmpeg`).

## Usage

```sh
.venv/bin/python transcribe.py sample_audio/sample.wav
```

This prints every word with its start/end time, e.g.:

```
  0.42s ->   0.68s   Hello
  0.68s ->   1.10s   world
```

and saves the full result (including sentence-level segments) to `transcript.json`.

Options:
- `--model` — Whisper model size: `tiny`, `base`, `small`, `medium`, `large-v2` (default `tiny`; bigger = more accurate, slower)
- `--device` — `cpu` or `cuda` (default `cpu`)

## Note on first run / network access

The first time you run `transcribe.py`, WhisperX downloads two models from
Hugging Face (`huggingface.co`): the Whisper speech-recognition model and a
wav2vec2 alignment model (the piece that turns "roughly this sentence" into
"exactly this word from this millisecond to that millisecond"). After the
first run they're cached locally (`~/.cache/huggingface`) and no network is
needed again.

**In this remote sandbox, `huggingface.co` is blocked by the environment's
network egress policy**, so the download — and therefore an actual
transcription — can't complete here. Everything else (ffmpeg, Python,
WhisperX, and all its dependencies) is installed and importable; only the
one-time model download is blocked. To see real output, run the two commands
above on a machine with normal internet access, or ask your workspace admin
to allow `huggingface.co` for this environment.
