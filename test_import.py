#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.expanduser("~/job-hunter-system"))
os.chdir(os.path.expanduser("~/job-hunter-system"))

try:
    from worker.submission.indeed_safari import IndeedSafariHandler
    print("✅ IndeedSafariHandler imported successfully")
    print(f"   Class: {IndeedSafariHandler}")
    
    # Quick instantiation test
    handler = IndeedSafariHandler()
    print(f"   Instance created: {handler}")
    print("✅ Safari integration verified!")
except Exception as e:
    print(f"❌ Import failed: {e}")
    import traceback
    traceback.print_exc()
