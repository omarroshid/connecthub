"""Estimate a voice's fundamental pitch (F0) from a wav file via autocorrelation.

Used to calibrate eSpeak NG's -p pitch parameter against a reference
voiceover sample — see docs/video-production/VOICE_PROFILE.md.

Needs numpy + scipy, which aren't installed for this project's plain
python3 — use the transcription app's venv instead:
    apps/transcription/.venv/bin/python scripts/analyze_pitch.py path/to/audio.wav
(mp3 input: convert first with `ffmpeg -i in.mp3 -ac 1 -ar 16000 out.wav`)
"""

import sys
import numpy as np
from scipy.io import wavfile

path = sys.argv[1]
sr, data = wavfile.read(path)
if data.dtype == np.int16:
    data = data.astype(np.float32) / 32768.0
elif data.dtype == np.int32:
    data = data.astype(np.float32) / 2147483648.0
if data.ndim > 1:
    data = data.mean(axis=1)

frame_len = int(sr * 0.04)  # 40ms
hop = int(sr * 0.02)  # 20ms
min_f0, max_f0 = 60, 400
min_lag = sr // max_f0
max_lag = sr // min_f0

f0s = []
for start in range(0, len(data) - frame_len, hop):
    frame = data[start:start + frame_len]
    energy = np.sqrt(np.mean(frame ** 2))
    if energy < 0.01:
        continue
    frame = frame - frame.mean()
    windowed = frame * np.hanning(len(frame))
    corr = np.correlate(windowed, windowed, mode="full")
    corr = corr[len(corr) // 2:]
    segment = corr[min_lag:max_lag]
    if len(segment) == 0:
        continue
    peak_idx = np.argmax(segment)
    lag = peak_idx + min_lag
    peak_val = segment[peak_idx]
    if corr[0] == 0 or peak_val / corr[0] < 0.3:
        continue
    f0 = sr / lag
    f0s.append(f0)

f0s = np.array(f0s)
print(f"Total frames analyzed: {len(f0s)}")
if len(f0s) > 0:
    print(f"Median F0: {np.median(f0s):.1f} Hz")
    print(f"Mean F0: {np.mean(f0s):.1f} Hz")
    print(f"P10-P90 F0: {np.percentile(f0s, 10):.1f} - {np.percentile(f0s, 90):.1f} Hz")
else:
    print("No voiced frames detected")

duration = len(data) / sr
print(f"Duration: {duration:.1f}s")
rms = np.sqrt(np.mean(data ** 2))
print(f"Overall RMS: {rms:.4f}")
