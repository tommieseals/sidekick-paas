#!/usr/bin/env python3
"""
Legion Dashboard API Server
Serves static files + API endpoints for legion-tracker.html
"""

import os
import json
import sqlite3
from datetime import datetime, timedelta
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

# Configuration
DASHBOARD_DIR = os.path.expanduser("~/clawd/dashboard")
DB_PATH = os.path.expanduser("~/job-hunter-system/data/legion.db")
PORT = 8080

def get_db_connection():
    """Get SQLite connection with row factory"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_legion_stats():
    """Get comprehensive stats for the dashboard"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total counts
    cursor.execute("SELECT COUNT(*) FROM jobs")
    total_scanned = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score >= 60")
    total_qualified = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM resume_versions")
    total_resumes = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM applications WHERE status = 'submitted'")
    total_submitted = cursor.fetchone()[0]
    
    # Today's counts
    today = datetime.now().strftime("%Y-%m-%d")
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE DATE(discovered_at) = ?", (today,))
    today_scanned = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score >= 60 AND DATE(discovered_at) = ?", (today,))
    today_qualified = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM resume_versions WHERE DATE(created_at) = ?", (today,))
    today_resumes = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM applications WHERE status = 'submitted' AND DATE(submitted_at) = ?", (today,))
    today_submitted = cursor.fetchone()[0]
    
    # Pipeline counts
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'discovered'")
    discovered = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score >= 65 AND status IN ('discovered', 'qualified')")
    qualified = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'researched'")
    researched = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score >= 50 AND status IN ('ready', 'pending_review')")
    ready = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM applications WHERE status = 'submitted'")
    submitted = cursor.fetchone()[0]
    
    # Score distribution
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score BETWEEN 0 AND 20")
    range_0_20 = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score BETWEEN 21 AND 40")
    range_21_40 = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score BETWEEN 41 AND 60")
    range_41_60 = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score BETWEEN 61 AND 80")
    range_61_80 = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE match_score BETWEEN 81 AND 100")
    range_81_100 = cursor.fetchone()[0]
    
    # Daily activity (last 7 days)
    daily_activity = []
    for i in range(6, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        cursor.execute("SELECT COUNT(*) FROM jobs WHERE DATE(discovered_at) = ?", (date,))
        count = cursor.fetchone()[0]
        daily_activity.append({"date": date, "count": count})
    
    # Platform distribution
    cursor.execute("""
        SELECT platform, COUNT(*) as count 
        FROM jobs 
        GROUP BY platform 
        ORDER BY count DESC 
        LIMIT 10
    """)
    platforms = {row['platform']: row['count'] for row in cursor.fetchall()}
    
    conn.close()
    
    return {
        "total_scanned": total_scanned,
        "total_qualified": total_qualified,
        "total_resumes": total_resumes,
        "total_submitted": total_submitted,
        "today_scanned": today_scanned,
        "today_qualified": today_qualified,
        "today_resumes": today_resumes,
        "today_submitted": today_submitted,
        "pipeline": {
            "discovered": discovered,
            "qualified": qualified,
            "researched": researched,
            "ready": ready,
            "submitted": submitted
        },
        "scores": {
            "range_0_20": range_0_20,
            "range_21_40": range_21_40,
            "range_41_60": range_41_60,
            "range_61_80": range_61_80,
            "range_81_100": range_81_100
        },
        "daily_activity": daily_activity,
        "platforms": platforms,
        "last_updated": datetime.now().isoformat()
    }

def get_jobs_for_approval(page=1, per_page=30, search=None, min_salary=None, remote_only=False):
    """Get jobs awaiting approval with filters"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build query
    conditions = ["match_score >= 50", "status NOT IN ('rejected', 'submitted', 'archived')"]
    params = []
    
    if search:
        conditions.append("(title LIKE ? OR company LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])
    
    if min_salary:
        conditions.append("salary_range LIKE ?")
        params.append(f"%{min_salary}%")
    
    if remote_only:
        conditions.append("remote_status IN ('remote', 'Remote', 'REMOTE', 'fully_remote')")
    
    where_clause = " AND ".join(conditions)
    
    # Get total count
    cursor.execute(f"SELECT COUNT(*) FROM jobs WHERE {where_clause}", params)
    total = cursor.fetchone()[0]
    total_pages = (total + per_page - 1) // per_page
    
    # Get paginated jobs
    offset = (page - 1) * per_page
    cursor.execute(f"""
        SELECT job_id, title, company, platform, match_score, salary_range, location, remote_status, url
        FROM jobs 
        WHERE {where_clause}
        ORDER BY match_score DESC, discovered_at DESC
        LIMIT ? OFFSET ?
    """, params + [per_page, offset])
    
    jobs = []
    for row in cursor.fetchall():
        jobs.append({
            "job_id": row['job_id'],
            "title": row['title'],
            "company": row['company'],
            "platform": row['platform'],
            "score": row['match_score'] or 0,
            "salary": row['salary_range'] or "Not specified",
            "location": row['location'] or "Unknown",
            "remote_status": row['remote_status'] or "unknown",
            "url": row['url']
        })
    
    conn.close()
    
    return {
        "jobs": jobs,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }

def approve_job(job_id, action):
    """Approve or reject a job"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if action == "approve":
        new_status = "approved"
    elif action == "reject":
        new_status = "rejected"
    else:
        conn.close()
        return {"success": False, "error": "Invalid action"}
    
    cursor.execute("UPDATE jobs SET status = ?, updated_at = ? WHERE job_id = ?", 
                   (new_status, datetime.now().isoformat(), job_id))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    
    return {"success": affected > 0, "job_id": job_id, "new_status": new_status}


class LegionAPIHandler(SimpleHTTPRequestHandler):
    """Custom handler for static files + API endpoints"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DASHBOARD_DIR, **kwargs)
    
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)
        
        # API endpoints
        if path == "/api/legion-stats":
            self.send_json_response(get_legion_stats())
        elif path == "/api/jobs-for-approval":
            page = int(query.get('page', [1])[0])
            per_page = int(query.get('per_page', [30])[0])
            search = query.get('search', [None])[0]
            min_salary = query.get('min_salary', [None])[0]
            remote_only = query.get('remote_only', ['false'])[0].lower() == 'true'
            
            result = get_jobs_for_approval(page, per_page, search, min_salary, remote_only)
            self.send_json_response(result)
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        parsed = urlparse(self.path)
        
        if parsed.path == "/api/approve-job":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            job_id = data.get('job_id')
            action = data.get('action')
            
            if not job_id or not action:
                self.send_json_response({"success": False, "error": "Missing job_id or action"}, 400)
            else:
                result = approve_job(job_id, action)
                self.send_json_response(result)
        else:
            self.send_error(404, "Not Found")
    
    def send_json_response(self, data, status=200):
        response = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response)
    
    def log_message(self, format, *args):
        # Suppress logging for cleaner output
        pass


def main():
    print(f"🏴 Legion Dashboard API Server")
    print(f"📂 Serving from: {DASHBOARD_DIR}")
    print(f"🗄️ Database: {DB_PATH}")
    print(f"🌐 URL: http://0.0.0.0:{PORT}")
    print(f"📊 Legion Tracker: http://localhost:{PORT}/legion-tracker.html")
    print("-" * 50)
    
    # Test database connection
    try:
        stats = get_legion_stats()
        print(f"✅ Database connected: {stats['total_scanned']:,} jobs found")
    except Exception as e:
        print(f"⚠️ Database warning: {e}")
    
    server = HTTPServer(('0.0.0.0', PORT), LegionAPIHandler)
    print(f"🚀 Server running on port {PORT}")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        server.shutdown()


if __name__ == "__main__":
    main()
