#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Churn at http://localhost:5555 ..."
node scripts/churn-dev-server.mjs --port 5555 --open
