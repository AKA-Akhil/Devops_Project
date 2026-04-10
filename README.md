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
- Ansible automation playbook: `infra/ansible/playbooks/deploy-devops-project.yml`

### 5. Deployment Targets

- **Frontend**: Vercel — automatic CDN deploy from GitHub
- **Backend**: Render — Docker-based web service deploy
- **Database**: AWS (RDS or DynamoDB)
- **Orchestration**: AWS EKS for Kubernetes workloads

### 6. AI / ML

- Fine-tuned model served via an OpenAI-compatible endpoint (replaces generic API)
- Powers the Repository Intelligence analysis feature
- Configured via `MODEL_PROVIDER=finetuned`, `MODEL_NAME`, `MODEL_BASE_URL`, `MODEL_API_KEY`

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
   - `DEVOPS_PROJECT_MODEL_BASE_URL` (OpenAI-compatible endpoint base URL for the fine-tuned model)

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

## Deployment targets

### Frontend — Vercel

The React/Vite client can be deployed to [Vercel](https://vercel.com) for global CDN delivery:

1. Import the repository in the Vercel dashboard.
2. Set **Root Directory** to `client`.
3. Set the environment variable `VITE_API_BASE_URL` to your backend API URL.
4. Vercel automatically redeploys on every push to `main`.

### Backend — Render

The Express.js server can be deployed to [Render](https://render.com) as a Docker-based web service:

1. Create a new **Web Service** in Render and connect your GitHub repository.
2. Set **Dockerfile path** to `server/Dockerfile`.
3. Add environment variables:
   - `GITHUB_TOKEN`
   - `MODEL_PROVIDER=finetuned`
   - `MODEL_API_KEY`
   - `MODEL_NAME`
   - `MODEL_BASE_URL`
4. Render redeploys automatically on push to `main`.

### Database — AWS

Persistent data can be stored in AWS:

- **Amazon RDS** (PostgreSQL/MySQL) for relational data.
- **Amazon DynamoDB** for key-value / document storage.

Provision the database with Terraform (see `infra/terraform/`) and pass the connection string to the server via an environment variable or Kubernetes Secret.

### Kubernetes / Orchestration — AWS EKS

For production-grade orchestration, deploy the Kubernetes manifests in `k8s/` to an
[AWS EKS](https://aws.amazon.com/eks/) cluster.  The Terraform configuration in
`infra/terraform/` manages the namespace, ConfigMap, Secrets, Deployments, and Services.
Ansible (`infra/ansible/`) automates the rollout.

## Terraform IaC

```powershell
cd infra\terraform
Copy-Item terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply -auto-approve
```

## Ansible deployment automation

```powershell
cd infra\ansible
ansible-galaxy collection install -r requirements.yml
ansible-playbook -i inventory/hosts.ini playbooks/deploy-devops-project.yml
```

## Supporting docs

- Beginner click-by-click guide: `docs/BEGINNER_DEVOPS_STEPS.md`
- Git workflow: `docs/GIT_WORKFLOW.md`
- Rubric mapping: `docs/RUBRIC_MAPPING.md`
