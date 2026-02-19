#!/usr/bin/env python3
"""Fix __init__.py to add visualizer imports to __all__"""

content = '''"""
LLM Cost Optimizer
==================
Analyze LLM API usage patterns and optimize routing for cost savings.
"""

from .analyzer import UsageAnalysis, UsageAnalyzer, UsageRecord
from .cli import main
from .optimizer import RoutingOptimizer, RoutingRecommendation, RoutingRule
from .visualizer import (
    ascii_bar_chart,
    ascii_decision_tree,
    ascii_pie_chart,
    generate_html_report,
    generate_markdown_report,
)

__version__ = "1.0.0"
__author__ = "Tommie Seals"
__all__ = [
    "UsageAnalyzer",
    "UsageAnalysis",
    "UsageRecord",
    "RoutingOptimizer",
    "RoutingRecommendation",
    "RoutingRule",
    "main",
    "ascii_bar_chart",
    "ascii_decision_tree",
    "ascii_pie_chart",
    "generate_html_report",
    "generate_markdown_report",
]
'''

with open('src/__init__.py', 'w') as f:
    f.write(content)
print("Fixed src/__init__.py")
