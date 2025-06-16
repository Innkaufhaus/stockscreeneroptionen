#!/usr/bin/env bash

# Exit on error
set -e

# Create and activate virtual environment
python3.11 -m venv .venv
source .venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install numpy first (required for pandas)
pip install numpy==1.24.3

# Install the rest of the requirements
pip install -r requirements.txt 