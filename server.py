#!/usr/bin/env python3
"""Local dev server that serves static files and proxies FRED API requests.
Reads FRED_API_KEY from environment or ~/.Renviron, injects it server-side."""

import http.server
import urllib.request
import urllib.parse
import json
import os
import sys
import re

PORT = 8080
FRED_BASE = "https://api.stlouisfed.org/fred"
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))


def load_fred_key():
    key = os.environ.get("FRED_API_KEY")
    if key:
        return key
    renviron = os.path.expanduser("~/.Renviron")
    if os.path.exists(renviron):
        with open(renviron) as f:
            for line in f:
                m = re.match(r'FRED_API_KEY\s*=\s*(.+)', line.strip())
                if m:
                    return m.group(1).strip().strip('"').strip("'")
    return None


FRED_KEY = load_fred_key()


class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_GET(self):
        if self.path.startswith("/fred/"):
            self.proxy_fred()
        else:
            super().do_GET()

    def proxy_fred(self):
        fred_path = self.path[len("/fred"):]
        parsed = urllib.parse.urlparse(fred_path)
        params = urllib.parse.parse_qs(parsed.query)
        params.pop("api_key", None)
        params["api_key"] = [FRED_KEY]
        new_query = urllib.parse.urlencode(params, doseq=True)
        url = FRED_BASE + parsed.path + "?" + new_query

        try:
            req = urllib.request.Request(url)
            req.add_header("User-Agent", "EconDashboard/1.0")
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Cache-Control", "public, max-age=300")
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            body = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def log_message(self, format, *args):
        if "/fred/" in (args[0] if args else ""):
            sys.stderr.write(f"  FRED proxy: {args[0]}\n")


if __name__ == "__main__":
    if not FRED_KEY:
        print("ERROR: No FRED_API_KEY found in environment or ~/.Renviron")
        sys.exit(1)
    print(f"FRED API key loaded (ends ...{FRED_KEY[-4:]})")
    server = http.server.HTTPServer(("", PORT), DashboardHandler)
    print(f"Dashboard server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
