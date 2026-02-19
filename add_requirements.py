#!/usr/bin/env python3
"""Add requirements.txt to repos that need them."""

import os

REQUIREMENTS = {
    "llm-cost-optimizer": """# LLM Cost Optimizer Dependencies
requests>=2.28.0
python-dotenv>=1.0.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
pandas>=2.0.0
matplotlib>=3.7.0
""",

    "doc-drift-detector": """# Doc Drift Detector Dependencies
gitpython>=3.1.0
markdown>=3.4.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
watchdog>=3.0.0
""",

    "asset-tracker": """# Asset Tracker Dependencies
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlalchemy>=2.0.0
aiosqlite>=0.19.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
pydantic>=2.5.0
pydantic-settings>=2.1.0
python-multipart>=0.0.6
httpx>=0.26.0
""",

    "infra-auditor": """# Infrastructure Auditor Dependencies
paramiko>=3.4.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
jinja2>=3.1.0
requests>=2.28.0
python-dotenv>=1.0.0
""",

    "llm-router": """# LLM Router Dependencies
requests>=2.28.0
python-dotenv>=1.0.0
click>=8.0.0
""",

    "node-health-monitor": """# Node Health Monitor Dependencies
psutil>=5.9.0
requests>=2.28.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
flask>=3.0.0
python-dotenv>=1.0.0
""",

    "service-watchdog": """# Service Watchdog Dependencies
psutil>=5.9.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
python-dotenv>=1.0.0
requests>=2.28.0
""",

    "pr-reviewer-action": """# PR Reviewer Action Dependencies
pygithub>=2.1.0
requests>=2.28.0
pyyaml>=6.0
python-dotenv>=1.0.0
""",

    "cost-tracker": """# Cost Tracker Dependencies
requests>=2.28.0
python-dotenv>=1.0.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
sqlite-utils>=3.35.0
""",

    "auto-healer": """# Auto Healer Dependencies
psutil>=5.9.0
pyyaml>=6.0
click>=8.0.0
rich>=13.0.0
python-dotenv>=1.0.0
requests>=2.28.0
"""
}

def main():
    for repo, content in REQUIREMENTS.items():
        filepath = os.path.expanduser(f"~/{repo}/requirements.txt")
        if not os.path.exists(filepath):
            with open(filepath, "w") as f:
                f.write(content)
            print(f"Created: {repo}/requirements.txt")
        else:
            print(f"Exists: {repo}/requirements.txt")

if __name__ == "__main__":
    main()
