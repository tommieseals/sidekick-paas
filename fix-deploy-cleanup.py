#!/usr/bin/env python3
"""Fix deploy.sh to run cleanup BEFORE creating new backup, not after"""
import os

deploy_path = os.path.expanduser("~/clawd/scripts/deploy.sh")

with open(deploy_path, 'r') as f:
    content = f.read()

# Find the line "# Create backup before deploy" and insert cleanup before it
old_section = '''    # Create backup before deploy
    local version=$(create_version_backup)'''

new_section = '''    # Cleanup old versions FIRST (prevents accumulation if deploy fails)
    cleanup_old_versions
    
    # Create backup before deploy
    local version=$(create_version_backup)'''

if '# Cleanup old versions FIRST' not in content:
    content = content.replace(old_section, new_section)
    
    # Also remove the cleanup at the end (to avoid running twice)
    content = content.replace('''
    # Cleanup old versions
    cleanup_old_versions
    
    log "========================================"
    log "Deployment finished at $(date)"''', '''
    log "========================================"
    log "Deployment finished at $(date)"''')
    
    with open(deploy_path, 'w') as f:
        f.write(content)
    print("Fixed: cleanup now runs BEFORE backup creation")
else:
    print("Already fixed")
