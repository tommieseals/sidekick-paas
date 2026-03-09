#!/usr/bin/env python3
"""Fix mobile nav scrolling in dashboard files."""
import os
import re

dashboard_dir = '/Users/tommie/clawd/dashboard'
css_fix = '''
        /* Mobile nav scroll fix - 2026-03-01 */
        @media (max-width: 768px) {
            .nav-links.active {
                max-height: 70vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        }'''

fixed = 0
for fname in os.listdir(dashboard_dir):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(dashboard_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has the fix
    if 'Mobile nav scroll fix' in content:
        continue
    
    # Find </style> and insert before it
    if '</style>' in content and '.nav-links' in content:
        content = content.replace('</style>', css_fix + '\n    </style>', 1)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed += 1
        print(f'✅ {fname}')

print(f'\nFixed {fixed} files with mobile nav scroll CSS')
