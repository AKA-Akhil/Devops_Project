# Devops project

Devops project is a full-stack repository intelligence application with a complete DevOps implementation aligned to your rubric.

## What is implemented for high rubric score

### 1. Version Control and Collaboration

- Branch strategy and commit conventions: `docs/GIT_WORKFLOW.md`
- Pull request template: `.github/PULL_REQUEST_TEMPLATE.md`
- Issue templates (bug + feature): `.github/ISSUE_TEMPLATE/`

### 2. CI/CD Pipeline (Build + Test + Deploy)

- GitHub Actions workflow: `.github/workflows/devops-project-cicd.yml`
- Build stage:
  - Install dependencies
  - Build client
- Test stage:
  - Run backend API test (`server/test/health.test.js`)
- Deploy stage:
  - Build and push Docker images to GHCR
  - Apply Kubernetes manifests
  - Roll out updated images automatically on `main`
  - Runs only when repository variable `ENABLE_K8S_DEPLOY=true`
  - Select runner mode with repository variable `DEPLOY_RUNNER`:
    - `self-hosted` for local Minikube deployments
    - `github-hosted` for remote reachable Kubernetes clusters

Note: Minikube kubeconfig from your laptop usually cannot be used by GitHub-hosted runners because it points to local file paths and localhost cluster endpoints.

### 3. Containerization and Orchestration

- Backend Docker image: `server/Dockerfile`
- Frontend Docker image with Nginx: `client/Dockerfile`
- Nginx API reverse-proxy config: `client/nginx.conf`
- Local multi-container run: `docker-compose.yml`
- Kubernetes deployment manifests: `k8s/`
  - Namespace, ConfigMap, Secret example, Deployments, Services, Ingress, HPA

### 4. Infrastructure as Code (IaC)

- Terraform infrastructure: `infra/terraform/`
  - Kubernetes resources (Namespace, Deployments, Services)
  - AWS RDS PostgreSQL database (`infra/terraform/aws.tf`)
- Ansible automation playbook: `infra/ansible/playbooks/deploy-devops-project.yml`

### 5. Production Deployments

- Frontend → **Vercel** (`client/vercel.json`)
- Backend API → **Render** (`render.yaml`)
- Database → **AWS RDS** (PostgreSQL, provisioned via Terraform)

### 6. AI Model

- **Fine-tuned model** via OpenAI-compatible API endpoint (replaces generic Gemini)
- Provider configured via `MODEL_PROVIDER=fine-tuned`
- Model ID set via `MODEL_NAME` (e.g., `ft:gpt-4o-mini:your-org:devops-project:abc123`)
- Base URL set via `MODEL_BASE_URL`

Detailed mapping to rubric criteria is in `docs/RUBRIC_MAPPING.md`.

## Local development

### Prerequisites

- Node.js 20+
- npm
- Docker Desktop (already installed by you)

### Run without Docker

1. Install backend dependencies:

```powershell
cd server
npm ci
```

2. Install frontend dependencies:

```powershell
cd ..\client
npm ci
```

3. Configure server environment:

```powershell
cd ..\server
Copy-Item .env.example .env
```

4. Start backend:

```powershell
npm run dev
```

5. In a new terminal, start frontend:

```powershell
cd ..\client
npm run dev
```

6. Open app: `http://localhost:5173`

### Run with Docker Compose

From project root:

```powershell
docker compose up --build -d
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8080/api/health`

Stop containers:

```powershell
docker compose down
```

## Kubernetes deployment

1. Enable Kubernetes in Docker Desktop:
   - Open Docker Desktop
   - Click **Settings**
   - Click **Kubernetes**
   - Enable **Enable Kubernetes**
   - Click **Apply & Restart**

2. Apply manifests from project root:

```powershell
kubectl apply -f k8s
kubectl get pods -n devops-project
kubectl get svc -n devops-project
```

3. If you use ingress locally, add host entry:

- `127.0.0.1 devops-project.local`

## GitHub Actions CI/CD setup (first-time)

Go to your repository in GitHub:

1. Click **Settings**
2. Click **Secrets and variables** -> **Actions**
3. Click **New repository secret** and add:
   - `KUBE_CONFIG_DATA`
   - `DEVOPS_PROJECT_GITHUB_TOKEN`
   - `DEVOPS_PROJECT_MODEL_API_KEY`

4. Click **Variables** (under Secrets and variables) -> **Actions** -> **New repository variable**
  - Name: `ENABLE_K8S_DEPLOY`
  - Value: `false` (set `true` only when using a reachable remote Kubernetes cluster)

PowerShell command to generate KUBE_CONFIG_DATA value:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME/.kube/config"))
```

Run workflow:

1. Open **Actions** tab
2. Select **Devops project CI CD Pipeline**
3. Click **Run workflow**
4. Select branch `main`
5. Click green **Run workflow** button

## Terraform IaC

```powershell
cd infra\terraform
Copy-Item terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply -auto-approve
```

After apply, copy the `rds_endpoint` output and set it as `DATABASE_URL` on Render.

## Ansible deployment automation

```powershell
cd infra\ansible
ansible-galaxy collection install -r requirements.yml
ansible-playbook -i inventory/hosts.ini playbooks/deploy-devops-project.yml
```

## Frontend deployment (Vercel)

1. Import repo into Vercel, set root directory to `client`.
2. Set `VITE_API_BASE_URL` to your Render backend URL.
3. Deploy — `client/vercel.json` configures build and SPA rewrites automatically.

## Backend deployment (Render)

1. Connect repo to Render — it auto-detects `render.yaml`.
2. Set secrets: `GITHUB_TOKEN`, `MODEL_NAME`, `MODEL_API_KEY`, `MODEL_BASE_URL`, `DATABASE_URL`.
3. Deploy.

## Supporting docs

- Beginner click-by-click guide: `docs/BEGINNER_DEVOPS_STEPS.md`
- Git workflow: `docs/GIT_WORKFLOW.md`
- Rubric mapping: `docs/RUBRIC_MAPPING.md`
- Claude flowchart prompt: `docs/CLAUDE_FLOWCHART_PROMPT.md`
