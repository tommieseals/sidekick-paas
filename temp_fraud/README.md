# Fraud Detection Platform

Real-time fraud detection system with ML scoring, rules engine, and monitoring.

## Overview

Production-grade fraud detection platform featuring:
- **ML Scoring**: Random Forest classifier with 10 engineered features
- **Rules Engine**: Velocity, device, amount, and temporal rules
- **Ensemble**: Weighted combination of ML + rules scores
- **Monitoring**: PSI-based drift detection and operational metrics
- **Dashboard**: Streamlit visualization for model performance

## Quick Start

```bash
pip install -r requirements.txt
make gen    # Generate synthetic data
make train  # Train model
make run    # Run API
make dash   # Run dashboard
```

## API Endpoints

- `POST /score` - Score a transaction for fraud
- `GET /health` - Health check

## Model Features

- amount_log: Log-transformed transaction amount
- amount_scaled: Scaled amount (0-10)
- hour_sin/cos: Cyclical hour encoding
- is_night: Flag for night hours
- is_weekend: Weekend indicator
- velocity_1h: Transaction count in last hour
- velocity_high: High velocity flag
- is_new_device: New device indicator
- amount_velocity_interaction: Amount x velocity interaction

## Rules Engine

- high_velocity: velocity >= 10 (score: 0.8)
- new_device_high_amount: new device + amount > 500 (score: 0.6)
- extreme_amount: amount > 5000 (score: 0.7)
- odd_hours_activity: hour < 5 + amount > 100 (score: 0.4)

## Monitoring

PSI-based drift detection:
- PSI < 0.1: No drift
- PSI 0.1-0.2: Slight drift
- PSI > 0.2: Significant drift (retrain recommended)

## Docker

```bash
docker build -t fraud-platform .
docker run -p 8000:8000 fraud-platform
```

## Testing

```bash
pytest tests/ -v
```

## License

MIT
