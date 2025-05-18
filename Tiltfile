# Tiltfile – build & deploy frontend with OTEL endpoint
allow_k8s_contexts('default')

k8s_yaml('./deploy/services/frontend/deploy.yml')  # load k8s resource

docker_build(
  'ghcr.io/tineoc/store-frontend:latest',
  './services/frontend',
)

default_registry('ghcr.io/tineoc')

# 3. Link the frontend k8s resource to the new image and forward port
k8s_resource(workload='frontend', port_forwards=[5173])

# 4. (Optional) Enable live update for rapid development
# live_update('store-frontend', [
#   sync('services/frontend', '/app'),
#   run('npm install', trigger=['package.json']),
#   run('npm run build', trigger=['src/', 'public/']),
# ])
