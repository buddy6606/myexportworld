import http.server
import socketserver
import os
import sys

PORT = 5500

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Decode URL path
        url_path = self.path.split('?')[0].split('#')[0]
        local_path = self.translate_path(url_path)

        # If requested path does not exist and doesn't end with .html, check if .html exists
        if not os.path.exists(local_path) and not local_path.endswith('.html'):
            html_path = local_path + '.html'
            if os.path.exists(html_path):
                # Internal rewrite path
                query_and_hash = self.path[len(url_path):]
                self.path = url_path + '.html' + query_and_hash

        return super().do_GET()

if __name__ == '__main__':
    # Force utf-8 encoding for stdout
    sys.stdout.reconfigure(encoding='utf-8')
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"Clean URL routing enabled: /about -> about.html, /inquiry -> inquiry.html")
        httpd.serve_forever()
