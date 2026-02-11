#!/bin/bash
# Generate sample German audio using macOS say command
# Then we can translate it

echo "Generating German test audio..."
say -v Anna "Guten Tag, ich bin Prozessingenieur in der PVB Industrie und benötige eine Analyse über die Hitze Verteilung" -o test-german-sample.aiff

echo "Converting to WAV..."
ffmpeg -i test-german-sample.aiff -acodec pcm_s16le -ar 16000 test-german-sample.wav -y 2>/dev/null

echo "✅ Sample created: test-german-sample.wav"
ls -lh test-german-sample.wav
