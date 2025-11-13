#!/usr/bin/env python3
"""
Serveur HTTP léger pour dev local
Usage: python dev_server.py
Accès: http://0.0.0.0:8000
"""

import http.server
import socketserver
import os

PORT = 8081
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🚀 Serveur lancé sur http://localhost:{PORT}")
    print("Ctrl+C pour arrêter")
    httpd.serve_forever()