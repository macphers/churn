#!/usr/bin/env python3
"""Open the local Mission Control server, starting it if needed.

Usage:
  python3 scripts/open-local.py
  python3 scripts/open-local.py --port 43110
  python3 scripts/open-local.py --port 43110 --path /output/index.html
"""

import argparse
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER = os.path.join(ROOT, 'scripts', 'setup-server.py')
SERVER_STATE_PATH = os.path.join(ROOT, '.context', 'server.json')
FALLBACK_PORTS = (3000, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089)
STARTUP_TIMEOUT_SECONDS = 5
POLL_INTERVAL_SECONDS = 0.25


def parse_args(argv):
    parser = argparse.ArgumentParser(description='Open Mission Control locally.')
    parser.add_argument('--port', type=int, help='Use a fixed port for a bookmarkable URL.')
    parser.add_argument(
        '--path',
        default='/',
        help='Open a specific path after starting the server.',
    )
    return parser.parse_args(argv)


def load_state():
    try:
        with open(SERVER_STATE_PATH, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return None


def server_responds(port):
    if not isinstance(port, int) or port <= 0:
        return False
    try:
        with urllib.request.urlopen(
            f'http://127.0.0.1:{port}/server-meta',
            timeout=1,
        ) as resp:
            if resp.status != 200:
                return False
            meta = json.load(resp)
            return meta.get('root') == ROOT
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, TimeoutError, OSError):
        return False


def find_running_port(forced_port=None):
    if forced_port is not None and server_responds(forced_port):
        return forced_port

    state = load_state()
    if state and server_responds(state.get('port')):
        return state['port']

    if forced_port is not None:
        return None

    for port in FALLBACK_PORTS:
        if server_responds(port):
            return port

    return None


def start_server(forced_port=None):
    cmd = [sys.executable, SERVER]
    if forced_port is not None:
        cmd.extend(['--port', str(forced_port)])

    subprocess.Popen(
        cmd,
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True,
    )

    deadline = time.time() + STARTUP_TIMEOUT_SECONDS
    while time.time() < deadline:
        state = load_state()
        if state and server_responds(state.get('port')):
            return state['port']

        if forced_port is not None:
            if server_responds(forced_port):
                return forced_port
        else:
            for port in FALLBACK_PORTS:
                if server_responds(port):
                    return port

        time.sleep(POLL_INTERVAL_SECONDS)

    return None


def main():
    args = parse_args(sys.argv[1:])
    port = find_running_port(args.port)
    if port is None:
        port = start_server(args.port)

    if port is None:
        if args.port is not None:
            print(
                f'Could not start the local server on port {args.port}. '
                f'Free that port or choose another one.'
            )
        else:
            print('Could not start the local server. Run python3 scripts/setup-server.py for logs.')
        sys.exit(1)

    path = args.path if args.path.startswith('/') else '/' + args.path
    url = f'http://127.0.0.1:{port}{path}'
    print(url)
    try:
        webbrowser.open(url, new=2)
    except Exception:
        pass


if __name__ == '__main__':
    main()
