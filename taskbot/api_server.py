#!/usr/bin/env python3
"""
TaskBot API Server
Handles lead capture and newsletter subscriptions
Saves to local JSON file for persistence
"""

import http.server
import socketserver
import json
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from pathlib import Path

# Configuration
PORT = 8081
DATA_DIR = Path(__file__).parent / 'data'
LEADS_FILE = DATA_DIR / 'leads.json'

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

def load_data():
    """Load leads data from JSON file"""
    if LEADS_FILE.exists():
        with open(LEADS_FILE, 'r') as f:
            return json.load(f)
    return {"leads": [], "newsletter": []}

def save_data(data):
    """Save leads data to JSON file"""
    with open(LEADS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

class APIHandler(http.server.BaseHTTPRequestHandler):
    
    def send_cors_headers(self):
        """Add CORS headers for frontend requests"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def send_json(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path == '/api/leads':
            # Return all leads
            data = load_data()
            self.send_json(data['leads'])
        
        elif path == '/api/newsletter':
            # Return all newsletter subscribers
            data = load_data()
            self.send_json(data['newsletter'])
        
        elif path == '/api/stats':
            # Return stats
            data = load_data()
            stats = {
                "totalLeads": len(data['leads']),
                "newLeads": sum(1 for l in data['leads'] if l.get('status') == 'new'),
                "contactedLeads": sum(1 for l in data['leads'] if l.get('status') == 'contacted'),
                "qualifiedLeads": sum(1 for l in data['leads'] if l.get('status') == 'qualified'),
                "convertedLeads": sum(1 for l in data['leads'] if l.get('status') == 'converted'),
                "newsletterSubscribers": len(data['newsletter']),
            }
            self.send_json(stats)
        
        elif path == '/api/health':
            self.send_json({"status": "ok", "timestamp": datetime.utcnow().isoformat()})
        
        else:
            self.send_json({"error": "Not found"}, 404)
    
    def do_POST(self):
        """Handle POST requests"""
        parsed = urlparse(self.path)
        path = parsed.path
        
        # Read request body
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            payload = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self.send_json({"error": "Invalid JSON"}, 400)
            return
        
        if path == '/api/leads':
            # Save a new lead
            data = load_data()
            
            # Generate ID if not provided
            if 'id' not in payload:
                payload['id'] = f"lead_{int(datetime.utcnow().timestamp())}_{len(data['leads'])}"
            
            if 'createdAt' not in payload:
                payload['createdAt'] = datetime.utcnow().isoformat()
            
            if 'status' not in payload:
                payload['status'] = 'new'
            
            data['leads'].append(payload)
            save_data(data)
            
            print(f"[LEAD] New lead captured: {payload.get('email')} from {payload.get('source')}")
            self.send_json(payload, 201)
        
        elif path == '/api/newsletter':
            # Save a newsletter subscriber
            data = load_data()
            
            email = payload.get('email', '').lower()
            
            # Check for existing subscriber
            if any(s.get('email', '').lower() == email for s in data['newsletter']):
                self.send_json({"error": "Email already subscribed"}, 409)
                return
            
            if 'id' not in payload:
                payload['id'] = f"sub_{int(datetime.utcnow().timestamp())}_{len(data['newsletter'])}"
            
            if 'subscribedAt' not in payload:
                payload['subscribedAt'] = datetime.utcnow().isoformat()
            
            data['newsletter'].append(payload)
            save_data(data)
            
            print(f"[NEWSLETTER] New subscriber: {email}")
            self.send_json(payload, 201)
        
        elif path == '/api/leads/status':
            # Update lead status
            data = load_data()
            lead_id = payload.get('id')
            new_status = payload.get('status')
            
            if not lead_id or not new_status:
                self.send_json({"error": "Missing id or status"}, 400)
                return
            
            for lead in data['leads']:
                if lead.get('id') == lead_id:
                    lead['status'] = new_status
                    save_data(data)
                    print(f"[LEAD] Updated status: {lead_id} -> {new_status}")
                    self.send_json(lead)
                    return
            
            self.send_json({"error": "Lead not found"}, 404)
        
        else:
            self.send_json({"error": "Not found"}, 404)
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {args[0]}")


def run_server():
    """Start the API server"""
    with socketserver.TCPServer(('0.0.0.0', PORT), APIHandler) as httpd:
        print(f"")
        print(f"🚀 TaskBot API Server running on http://localhost:{PORT}")
        print(f"")
        print(f"Endpoints:")
        print(f"  GET  /api/leads      - List all leads")
        print(f"  POST /api/leads      - Create new lead")
        print(f"  GET  /api/newsletter - List subscribers")
        print(f"  POST /api/newsletter - Add subscriber")
        print(f"  GET  /api/stats      - Get statistics")
        print(f"  GET  /api/health     - Health check")
        print(f"")
        print(f"Data saved to: {LEADS_FILE}")
        print(f"")
        httpd.serve_forever()


if __name__ == '__main__':
    run_server()
