#!/usr/bin/env python3
"""
Kimi K2.5 API Example via NVIDIA
Model: moonshotai/kimi-k2.5
Max tokens: 16384
Supports thinking mode
"""

import requests

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
stream = True

headers = {
    "Authorization": "Bearer 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",
    "Accept": "text/event-stream" if stream else "application/json"
}

payload = {
    "model": "moonshotai/kimi-k2.5",
    "messages": [{"role":"user","content":""}],
    "max_tokens": 16384,
    "temperature": 1.00,
    "top_p": 1.00,
    "stream": stream,
    "chat_template_kwargs": {"thinking":True},
}

response = requests.post(invoke_url, headers=headers, json=payload)

if stream:
    for line in response.iter_lines():
        if line:
            print(line.decode("utf-8"))
else:
    print(response.json())
