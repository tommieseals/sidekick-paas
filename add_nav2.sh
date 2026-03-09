#!/bin/bash
cd /Users/tommie/clawd/dashboard
cp index.html index.html.backup-terminator2
awk '/Fraud/{print; print "                <a href=\"/terminator.html\" class=\"nav-link\">🤖 TerminatorBot</a>"; next}1' index.html.backup-terminator2 > index.html
grep -i terminator index.html || echo "Still not found"
