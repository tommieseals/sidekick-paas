# Tradier API

**Added:** 2026-02-27

## Production (LIVE MONEY)
```
Token: 3tQdWwMQKGqSrRG9bP5w1N0gAukk
```

## Sandbox (Paper Trading) 
```
Account: VA80461088
Token: kikIYi4LsL2WGdbfJ4iHPRKIZaEt
```

## Base URLs
- **Production:** https://api.tradier.com/v1
- **Sandbox (Paper):** https://sandbox.tradier.com/v1

## Usage
```bash
# Get account info
curl -X GET "https://api.tradier.com/v1/user/profile" \
  -H "Authorization: Bearer 3tQdWwMQKGqSrRG9bP5w1N0gAukk" \
  -H "Accept: application/json"

# Get market quotes
curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols=AAPL,MSFT" \
  -H "Authorization: Bearer 3tQdWwMQKGqSrRG9bP5w1N0gAukk" \
  -H "Accept: application/json"

# Get options chain
curl -X GET "https://api.tradier.com/v1/markets/options/chains?symbol=AAPL" \
  -H "Authorization: Bearer 3tQdWwMQKGqSrRG9bP5w1N0gAukk" \
  -H "Accept: application/json"
```

## Python Example
```python
import requests

TRADIER_TOKEN = "3tQdWwMQKGqSrRG9bP5w1N0gAukk"
BASE_URL = "https://api.tradier.com/v1"

headers = {
    "Authorization": f"Bearer {TRADIER_TOKEN}",
    "Accept": "application/json"
}

# Get account profile
response = requests.get(f"{BASE_URL}/user/profile", headers=headers)
print(response.json())

# Get quote
response = requests.get(f"{BASE_URL}/markets/quotes", 
    headers=headers, 
    params={"symbols": "AAPL,TSLA,SPY"})
print(response.json())
```

## Features
- Commission-free stock & ETF trades
- Options trading
- Real-time market data
- Paper trading (sandbox)
- WebSocket streaming

## For Project Vault
This is the primary brokerage API for the Markets Department.
