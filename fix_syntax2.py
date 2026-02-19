#!/usr/bin/env python3
"""Fix broken string literals in Python files - Phase 2."""
import re
import sys
from pathlib import Path

def fix_file(filepath):
    with open(filepath, "r") as f:
        lines = f.readlines()
    
    fixed_lines = []
    for line in lines:
        original = line
        
        # Fix broken f-strings like: id=fpd- unknown)},
        # These should be: id=f"pd-{incident_data.get('id', 'unknown')}",
        line = re.sub(r'id=fpd- unknown\)\},', 'id=f"pd-{incident_data.get(\'id\', \'unknown\')}",', line)
        line = re.sub(r'id=fdd- unknown\)\},', 'id=f"dd-{payload.get(\'id\', \'unknown\')}",', line)
        line = re.sub(r'id=fgf- unknown\)\},', 'id=f"gf-{payload.get(\'ruleId\', \'unknown\')}",', line)
        line = re.sub(r'id=fprom-fingerprint,', 'id=f"prom-{fingerprint}",', line)
        line = re.sub(r'id=fcustom- datetime\.utcnow\(\)\.strftime\(%Y%m%d%H%M%S\)\)\},', 
                     'id=f"custom-{datetime.utcnow().strftime(\'%Y%m%d%H%M%S\')}",', line)
        
        # Fix title f-strings
        line = re.sub(r'title=f\[ warning\)\.upper\(\)\}] alert_name,', 
                     'title=f"[{labels.get(\'severity\', \'warning\').upper()}] {alert_name}",', line)
        
        # Fix unquoted string arguments like: title=incident_data.get("title", Unknown PagerDuty Incident),
        line = re.sub(r', ([A-Z][a-zA-Z]+ [A-Za-z ]+)\)', r', "\1")', line)
        line = re.sub(r', ([A-Z][a-zA-Z]+)\)', r', "\1")', line)
        
        # Fix broken dictionary keys in multiline dicts
        # service: -> "service":
        if re.match(r'^\s+[a-z_]+:', line) and not re.match(r'^\s+def |^\s+class |^\s+if |^\s+for |^\s+while |^\s+try:|^\s+except:|^\s+else:|^\s+elif ', line):
            line = re.sub(r'^(\s+)([a-z_][a-z0-9_]*):', r'\1"\2":', line)
        
        # Fix logger calls with broken f-strings
        # logger.info(fReceived webhook from source) -> logger.info(f"Received webhook from {source}")
        line = re.sub(r'logger\.(info|error|warning|debug)\(f([A-Z][a-zA-Z ]+) from ([a-z_]+)\)', 
                     r'logger.\1(f"\2 from {\3}")', line)
        line = re.sub(r'logger\.(info|error|warning|debug)\(f([A-Z][a-zA-Z ]+) ([a-z_]+)\)', 
                     r'logger.\1(f"\2 {\3}")', line)
        line = re.sub(r'logger\.(info|error|warning|debug)\(f\[([a-z_\.]+)\] ([A-Za-z ]+)\.\.\.\)', 
                     r'logger.\1(f"[{\2}] \3...")', line)
        line = re.sub(r'logger\.(info|error|warning|debug)\(f\[([a-z_]+)\] ([A-Za-z ]+): ([a-z_]+),', 
                     r'logger.\1(f"[{\2}] \3: {\4}",', line)
        
        # Fix fk8s-event/namespace -> f"k8s-event/{namespace}"
        line = re.sub(r'=fk8s-event/([a-z_]+),', r'=f"k8s-event/{\1}",', line)
        line = re.sub(r'=fk8s-([a-z]+)/([a-z_]+),', r'=f"k8s-\1/{\2}",', line)
        
        # Fix raise ValueError(No alerts...) -> raise ValueError("No alerts...")
        line = re.sub(r'raise ValueError\(([A-Z][^)]+)\)', r'raise ValueError("\1")', line)
        
        # Fix web route strings: /webhook/source -> "/webhook/{source}"
        line = re.sub(r'\.add_post\(/webhook/source,', '.add_post("/webhook/{source}",', line)
        line = re.sub(r'\.add_post\(/webhook,', '.add_post("/webhook",', line)
        line = re.sub(r'\.add_get\(/health,', '.add_get("/health",', line)
        line = re.sub(r'\.add_get\(/incidents,', '.add_get("/incidents",', line)
        line = re.sub(r'\.add_post\(/incidents/id/resolve,', '.add_post("/incidents/{id}/resolve",', line)
        line = re.sub(r'\.add_get\(/incidents/id,', '.add_get("/incidents/{id}",', line)
        line = re.sub(r'\.add_get\(/stats,', '.add_get("/stats",', line)
        
        # Fix json_response errors: {error: Invalid JSON -> {"error": "Invalid JSON"
        line = re.sub(r'\{error: ([A-Z][^}]+)\}', r'{"error": "\1"}', line)
        line = re.sub(r'\{error: ([a-z][^}]+)\}', r'{"error": "\1"}', line)
        
        # Fix default parameter: host: str = 0.0.0.0 -> host: str = "0.0.0.0"
        line = re.sub(r': str = (\d+\.\d+\.\d+\.\d+)', r': str = "\1"', line)
        
        # Fix format string in logging: format=%(asctime)s -> format="%(asctime)s..."
        line = re.sub(r'format=%\(asctime\)s \[%\(levelname\)s\] %\(name\)s: %\(message\)s', 
                     'format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"', line)
        
        # Fix Config not found: fConfig not found at config_path -> f"Config not found at {config_path}"
        line = re.sub(r'fConfig not found at config_path, using defaults\)', 
                     'f"Config not found at {config_path}, using defaults")', line)
        
        # Fix fStarting Incident Copilot server on host:port
        line = re.sub(r'fStarting Incident Copilot server on host:port\)', 
                     'f"Starting Incident Copilot server on {host}:{port}")', line)
        
        # Fix simple patterns in .get calls
        line = re.sub(r'\.get\(server, \{\}\)', '.get("server", {})', line)
        line = re.sub(r'\.get\(host, "0\.0\.0\.0"\)', '.get("host", "0.0.0.0")', line)
        line = re.sub(r'\.get\(port, 8080\)', '.get("port", 8080)', line)
        
        # Fix version: 0.1.0 -> "version": "0.1.0"
        line = re.sub(r'version: (\d+\.\d+\.\d+)', r'"version": "\1"', line)
        
        # Fix f-strings with since_seconds
        line = re.sub(r'f--since=since_secondss,', 'f"--since={since_seconds}s",', line)
        
        fixed_lines.append(line)
    
    with open(filepath, "w") as f:
        f.writelines(fixed_lines)
    print(f"Fixed phase 2: {filepath}")

if __name__ == "__main__":
    src_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "src")
    for py_file in src_dir.glob("*.py"):
        fix_file(py_file)
