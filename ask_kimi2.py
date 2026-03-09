#!/usr/bin/env python3
"""Ask Kimi for creative logo implementation."""
import requests
import json

response = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
    },
    json={
        "model": "nvidia/llama-3.1-nemotron-70b-instruct",
        "messages": [{
            "role": "user", 
            "content": "I have an animated Skynet logo GIF (red and cyan cyberpunk style). I want epic CSS to display it as main branding on a purple gradient dashboard. Give me HTML and CSS with: 200px size, cyan glow effect, hover animation. The file is /skynet_loading.gif"
        }],
        "temperature": 0.7,
        "max_tokens": 1500
    },
    timeout=60
)

data = response.json()
if 'choices' in data:
    print(data['choices'][0]['message']['content'])
else:
    print("API Error:", json.dumps(data, indent=2))
