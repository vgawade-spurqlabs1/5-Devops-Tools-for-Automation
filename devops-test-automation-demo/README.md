# DevOps Test Automation Demo (Jenkins + Docker + Kubernetes + Terraform)

This repository is a **structure-first** reference project that matches the code patterns used in the blog:
**“5 Must‑Have DevOps Tools for Test Automation in CI/CD (With Practical, Real‑World Examples)”**.

It demonstrates how these parts fit together:

- **Git + Jenkinsfile** (pipeline as code)
- **Docker** for the app image and for an optional containerized test runner
- **Kubernetes** manifests for deploying an ephemeral environment per PR/branch
- **Terraform** folder showing an Infrastructure-as-Code pattern (lightweight starter)

> Notes  
> - Values like `registry.example.com` are placeholders.  
> - You must plug in your own registry, Kubernetes cluster context, and credentials.

---

## Repository structure

```
devops-test-automation-demo/
├─ Jenkinsfile
├─ docker-compose.yml
├─ k8s/
│  ├─ app-deployment.yaml
│  ├─ app-service.yaml
│  └─ e2e-job.yaml
├─ app/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ .eslintrc.cjs
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ server.js
│  │  └─ utils/
│  │     └─ math.js
│  └─ test/
│     └─ unit/
│        └─ math.test.js
├─ tests/
│  ├─ api/
│  │  ├─ Dockerfile
│  │  ├─ package.json
│  │  └─ tests/
│  │     └─ api.test.js
│  └─ e2e/
│     ├─ Dockerfile
│     ├─ package.json
│     ├─ playwright.config.js
│     └─ tests/
│        └─ smoke.spec.js
└─ infra/
   └─ terraform/
      ├─ main.tf
      ├─ variables.tf
      ├─ outputs.tf
      └─ README.md
```

---

## Quick start (local)

### 1) Run the app locally
```bash
cd app
npm install
npm run start
# app runs at http://localhost:8080
```

### 2) Run API tests locally
```bash
cd tests/api
npm install
BASE_URL=http://localhost:8080 npm test
```

### 3) Run E2E tests locally (Playwright)
```bash
cd tests/e2e
npm install
BASE_URL=http://localhost:8080 npm run test:smoke
# HTML report in tests/e2e/e2e-report/
```

---

## Docker Compose (local reproducibility)

This starts the app, then runs API tests and E2E smoke tests against it.

```bash
docker compose up --build --exit-code-from api-tests
# (Optional) to run E2E in compose as well:
docker compose up --build --exit-code-from e2e-tests
```

---

## Kubernetes (ephemeral environment pattern)

### 1) Apply manifests into a namespace
```bash
kubectl create namespace pr-123 || true
kubectl -n pr-123 apply -f k8s/app-deployment.yaml
kubectl -n pr-123 apply -f k8s/app-service.yaml
kubectl -n pr-123 rollout status deployment/demo-app --timeout=180s
```

### 2) Run E2E tests as a Kubernetes Job (inside the cluster)
Build and push the E2E image first, then replace `__E2E_IMAGE__` in `k8s/e2e-job.yaml`.

```bash
sed "s|__E2E_IMAGE__|registry.example.com/e2e-tests:local|g" k8s/e2e-job.yaml | kubectl -n pr-123 apply -f -
kubectl -n pr-123 wait --for=condition=complete job/e2e-tests --timeout=15m
kubectl -n pr-123 logs job/e2e-tests
```

### 3) Cleanup
```bash
kubectl delete namespace pr-123
```

---

## Jenkins

The `Jenkinsfile` shows a realistic flow:

1. Lint + unit tests  
2. Build/push app image  
3. Build/push E2E image  
4. Deploy to Kubernetes namespace  
5. API tests via `kubectl port-forward`  
6. E2E tests via Kubernetes Job  
7. Cleanup namespace  

### Jenkins prerequisites
- Jenkins agent with: `docker`, `kubectl`, and access to the Kubernetes cluster  
- Docker registry credentials configured in Jenkins  
- Kubernetes access configured (commonly via kubeconfig or service account)

Update placeholders inside `Jenkinsfile`:
- `DOCKER_REGISTRY`  
- any credential bindings you use for registry / kubeconfig  

---

## Disclaimer

This is a reference starter, intended for learning and adapting.  
For production, add:
- secret management (Kubernetes secrets / Vault / cloud secret managers)
- image scanning (Trivy/Snyk)
- policy gates (OPA/Gatekeeper, signed images)
- richer reporting (Allure, ReportPortal)
