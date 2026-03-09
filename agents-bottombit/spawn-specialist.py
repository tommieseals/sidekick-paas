#!/usr/bin/env python3
"""
Bottom Bitch Specialist Spawner (Python cross-platform version)
Usage: python spawn-specialist.py <specialist> <task>
Example: python spawn-specialist.py codegen "Create Python script to parse JSON logs"
"""

import sys
import subprocess
import json
import time
import os
from datetime import datetime
from pathlib import Path

VALID_SPECIALISTS = [
    "codegen", "debugger", "devops", "research", 
    "vision", "writer", "router"
]

SPECIALIST_DESCRIPTIONS = {
    "codegen": "Code generation and implementation",
    "debugger": "Bug hunting and fixes",
    "devops": "Infrastructure and deployment",
    "research": "Information gathering and analysis",
    "vision": "Image/screenshot analysis",
    "writer": "Documentation and content creation",
    "router": "Task orchestration and planning"
}

def print_usage():
    """Print usage information"""
    print("Usage: spawn-specialist.py <specialist> <task>")
    print()
    print("Available specialists:")
    for spec, desc in SPECIALIST_DESCRIPTIONS.items():
        print(f"  {spec:12s} - {desc}")
    print()
    print("Example:")
    print("  python spawn-specialist.py codegen 'Create Python script to parse JSON logs'")

def spawn_specialist(specialist: str, task: str):
    """Spawn a Bottom Bitch specialist agent"""
    
    # Validate specialist
    if specialist not in VALID_SPECIALISTS:
        print(f"❌ Error: Invalid specialist '{specialist}'")
        print(f"Valid options: {', '.join(VALID_SPECIALISTS)}")
        sys.exit(1)
    
    # Generate session label
    timestamp = int(time.time())
    label = f"bottombit-{specialist}-{timestamp}"
    
    print(f"🚢 Spawning Bottom Bitch specialist: {specialist}")
    print(f"📋 Task: {task}")
    print(f"🏷️  Label: {label}")
    print()
    
    # Construct spawn task
    spawn_task = f"""You are {specialist} specialist in Bottom Bitch's swarm. Your task: {task}

IMPORTANT:
1. Read ~/clawd/agents-bottombit/{specialist}/SOUL.md first
2. Read ~/clawd/agents-bottombit/{specialist}/AGENTS.md 
3. Complete the assigned task
4. Report results when done
5. You are ephemeral - no heartbeats, no side quests

Your session: agent:bottombit:{specialist}:{label}
Parent: Bottom Bitch (Dell agent)
Access: Restricted to tool use, NO external messaging"""
    
    # Try multiple spawn methods
    success = False
    
    # Method 1: Direct sessions_spawn command
    try:
        result = subprocess.run(
            ["sessions_spawn", f"--label={label}", f"--task={spawn_task}"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            print("✅ Spawn request sent via sessions_spawn")
            success = True
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    
    # Method 2: SSH to Mac Mini
    if not success:
        try:
            ssh_cmd = f"sessions_spawn --label='{label}' --task='{spawn_task}'"
            result = subprocess.run(
                ["ssh", "tommie@100.88.105.106", ssh_cmd],
                capture_output=True,
                text=True,
                timeout=15
            )
            if result.returncode == 0:
                print("✅ Spawn request sent via SSH to Mac Mini")
                success = True
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
    
    # Method 3: Write spawn request file
    if not success:
        try:
            spawn_request_dir = Path.home() / "clawd" / "shared-memory" / "spawn-requests"
            spawn_request_dir.mkdir(parents=True, exist_ok=True)
            
            spawn_request_path = spawn_request_dir / f"{label}.json"
            spawn_request = {
                "label": label,
                "specialist": specialist,
                "task": task,
                "parent": "bottom-bitch",
                "timestamp": datetime.now().isoformat(),
                "host": os.environ.get("COMPUTERNAME", os.uname().nodename)
            }
            
            with open(spawn_request_path, 'w') as f:
                json.dump(spawn_request, f, indent=2)
            
            print(f"📁 Spawn request saved to: {spawn_request_path}")
            print("⚠️  Note: Main agent needs to pick up this request")
        except Exception as e:
            print(f"❌ Failed to write spawn request file: {e}")
    
    # Method 4: Manual instructions
    if not success:
        print()
        print("❌ Automatic spawn failed")
        print()
        print("Manual spawn instructions:")
        print("Send this to Telegram or Clawdbot:")
        print()
        print(f"/spawn {label}")
        print()
        print("Task:")
        print(spawn_task)
    
    # Print monitoring info
    print()
    print("📊 Monitor: http://100.88.105.106:8080/swarm-monitor.html")
    print(f"🔍 Check status: sessions_list | grep {label}")
    
    # Update shared memory status
    try:
        status_file = Path.home() / "clawd" / "shared-memory" / "bottombit-swarm-status.json"
        
        # Read current status or create new
        if status_file.exists():
            with open(status_file, 'r') as f:
                status = json.load(f)
        else:
            status = {
                "last_updated": None,
                "active_sessions": [],
                "completed_today": 0,
                "total_spawns": 0
            }
        
        # Add new session
        status["last_updated"] = datetime.now().isoformat()
        status["active_sessions"].append({
            "session": f"agent:bottombit:{specialist}:{timestamp}",
            "specialist": specialist,
            "task": task[:100],  # Truncate long tasks
            "started": datetime.now().isoformat(),
            "status": "spawning",
            "label": label
        })
        status["total_spawns"] = status.get("total_spawns", 0) + 1
        
        # Write back
        status_file.parent.mkdir(parents=True, exist_ok=True)
        with open(status_file, 'w') as f:
            json.dump(status, f, indent=2)
            
    except Exception as e:
        print(f"⚠️  Could not update shared memory status: {e}")

def main():
    """Main entry point"""
    if len(sys.argv) < 3:
        print_usage()
        sys.exit(1)
    
    specialist = sys.argv[1].lower()
    task = " ".join(sys.argv[2:])
    
    spawn_specialist(specialist, task)

if __name__ == "__main__":
    main()
