#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="kind"

echo "▶️  Checking Kind cluster..."

# 1) Create Kind cluster if it doesn't exist
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  echo "🛠️  Creating Kind cluster '${CLUSTER_NAME}'..."
  kind create cluster --name "${CLUSTER_NAME}"
else
  echo "✔️  Kind cluster '${CLUSTER_NAME}' already exists."
fi

# 2) Wait until the Kubernetes API is reachable
echo "⏳ Waiting for Kubernetes API to become ready..."
until kubectl get nodes &>/dev/null; do
  sleep 2
done

echo "✅ Kind cluster '${CLUSTER_NAME}' is ready!"
