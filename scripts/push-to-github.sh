#!/bin/bash
set -e
cd "$(dirname "$0")/.."

if ! gh auth status &>/dev/null; then
  echo "Not logged into GitHub. Run: gh auth login"
  exit 1
fi

REPO_NAME="${1:-pipeline-crm}"
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
echo "Done: https://github.com/$(gh api user -q .login)/$REPO_NAME"
