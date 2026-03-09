#!/bin/bash
cd /Users/tommie/clawd/dashboard
cp index.html index.html.backup-terminator
awk '/Fraud<\/a>/{print; print "                <a href=\"/terminator.html\" class=\"nav-link\">🤖 TerminatorBot</a>"; next}1' index.html.backup-terminator > index.html
echo "Done adding TerminatorBot link"
