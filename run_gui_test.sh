#!/bin/bash
# Run the non-headless test with GUI access
cd /Users/tommie/job-hunter-system
.venv/bin/python /tmp/test_nonheadless.py 2>&1 | tee /tmp/turnstile_test.log
