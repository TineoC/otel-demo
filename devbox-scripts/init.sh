#!/usr/bin/env bash
set -euo pipefail

# Single init script: creates Kind cluster, installs Argo CD, deploys the OTel Operator, 
# and port-forwards both Argo CD UI and OTLP collector.

CLUSTER_NAME="kind"
ARGOCD_NS="argocd"
LOCAL_ARGO_PORT=8080
REMOTE_ARGO_PORT=443
OTEL_NS="opentelemetry-operator"

# Cleanup function to kill background port-forwards
cleanup() {
  echo "⏹️  Shutting down port-forwards..."
  kill "${ARGO_PID}" "${OTEL_PID}" 2>/dev/null || true
}
trap cleanup EXIT

echo "▶️  Starting dev environment bootstrap..."

# 1) Create Kind cluster if it doesn't exist
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  echo "🛠️  Creating Kind cluster '${CLUSTER_NAME}'..."
  kind create cluster --name "${CLUSTER_NAME}"
else
  echo "✔️  Kind cluster '${CLUSTER_NAME}' already exists."
fi

# 2) Install Argo CD
echo "🛠️  Installing Argo CD in namespace '${ARGOCD_NS}'..."
kubectl get ns "${ARGOCD_NS}" &>/dev/null || kubectl create ns "${ARGOCD_NS}"
kubectl apply -n "${ARGOCD_NS}" -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "⏳ Waiting for Argo CD server to come up..."
kubectl rollout status deployment/argocd-server -n "${ARGOCD_NS}" --timeout=120s

# 3) Port-forward Argo CD UI
echo "🔗 Port-forwarding Argo CD UI to http://localhost:${LOCAL_ARGO_PORT} ..."
kubectl port-forward svc/argocd-server -n "${ARGOCD_NS}" "${LOCAL_ARGO_PORT}:${REMOTE_ARGO_PORT}" &
ARGO_PID=$!

echo "🚀 Deploying services via Argo CD..."
kubectl apply -f ./deploy/argocd

echo "✅ Dev environment is ready!"
echo "   • Argo CD UI: http://localhost:${LOCAL_ARGO_PORT}"
echo "   • OTLP endpoint: http://localhost:${LOCAL_OTEL_PORT}/v1/traces"
echo
echo "Press Ctrl+C to shut down the port-forwards and exit."

# Keep the script alive so the port-forwards stay up
wait
