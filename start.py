import sys
import os
import webbrowser
import http.server
import socketserver
import threading
import time

PORT = 8000

# Try to find an available port starting from 8000
for p in range(8000, 8100):
    try:
        with socketserver.TCPServer(("", p), None) as s:
            PORT = p
            break
    except OSError:
        continue

def open_browser():
    time.sleep(0.5)
    webbrowser.open(f"http://127.0.0.1:{PORT}")

print("===================================================")
print(f"  Γ 的个人网站本地服务已启动，正在运行在端口 {PORT}...")
print("  服务启动后会自动在您的浏览器中打开网页。")
print("  按 Ctrl+C 或关闭本窗口即可停止服务。")
print("===================================================")

threading.Thread(target=open_browser, daemon=True).start()

Handler = http.server.SimpleHTTPRequestHandler
# Ensure the server serves files from the directory of start.py
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n正在停止服务...")
        sys.exit(0)
