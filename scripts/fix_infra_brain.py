#!/usr/bin/env python3
"""Add brain section loader to infrastructure.html"""

import os

infra_path = "/Users/tommie/clawd/dashboard/infrastructure.html"

with open(infra_path, "r") as f:
    content = f.read()

brain_loader = '''
<!-- Dynamic Brain Section -->
<div id="brain-container" style="padding: 20px;"></div>
<script>
fetch("infra-sections/07-brain.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("brain-container").innerHTML = html;
  })
  .catch(e => console.error("Brain section failed:", e));
</script>
'''

if "brain-container" not in content:
    content = content.replace("</body>", brain_loader + "</body>")
    with open(infra_path, "w") as f:
        f.write(content)
    print("Brain section loader added!")
else:
    print("Brain section already present")
