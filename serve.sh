#!/bin/bash
# Serve Churn locally on port 5555
cd "$(dirname "$0")/output" || exit 1
echo "Churn running at http://localhost:5555"
open http://localhost:5555
python3 -m http.server 5555
