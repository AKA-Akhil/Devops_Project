# Claude Prompt — Generate Project Flowchart

Copy the prompt below and paste it directly into Claude to generate a complete Mermaid flowchart for this project.

---

## Prompt

```
Please generate a detailed Mermaid top-down flowchart (graph TD) for a full-stack DevOps project called "Devops Project" — a repository intelligence application. The diagram must cover every layer of the system: source control, CI/CD pipeline, containerisation, container orchestration, infrastructure as code, production deployments, cloud services, and the AI model. Use clear sub-graph blocks to group related stages. Follow the exact architecture described below.

---

### Source Control
- Developer writes code locally and pushes commits to a GitHub repository.
- Branches: `main` (production), `develop` (integration).
- Pull requests go through a review template before merge to `main`.

---

### CI/CD Pipeline — GitHub Actions
The pipeline triggers on every push to `main` or `develop`, and on pull requests targeting `main`.

**Stage 1 — Build & Test (runs on ubuntu-latest)**
- Checkout source code
- Set up Node.js 20 with npm cache
- Install backend dependencies (`npm ci` in `server/`)
- Run backend unit tests (`npm test`)
- Install frontend dependencies (`npm ci` in `client/`)
- Build React frontend (`npm run build`) to validate compilation

**Stage 2 — Docker Build & Push (runs after Stage 1, skipped on pull requests)**
- Log in to GitHub Container Registry (GHCR)
- Build and push backend Docker image → `ghcr.io/<owner>/devops-project-server:<sha>` and `:latest`
- Build and push frontend Docker image (React + Nginx) → `ghcr.io/<owner>/devops-project-client:<sha>` and `:latest`

**Stage 3 — Deploy to Kubernetes (runs after Stage 2, only on `main` when `ENABLE_K8S_DEPLOY=true`)**
- Two runner modes: `github-hosted` (remote cluster) or `self-hosted` (local Minikube)
- Decode and apply `KUBE_CONFIG_DATA` secret
- Apply Kubernetes manifests: Namespace, ConfigMap, Secret, Deployments, Services, Ingress, HPA
- Roll out updated images with `kubectl set image`
- Wait for rollout status

---

### Infrastructure as Code

**Terraform** (in `infra/terraform/`)
- Provider: `hashicorp/kubernetes` (manages the Kubernetes cluster resources)
- Provider: `hashicorp/aws` (manages AWS cloud resources)
- Resources provisioned:
  - Kubernetes Namespace, ConfigMap, Secret
  - Kubernetes Deployments and Services for backend and frontend
  - AWS RDS instance (PostgreSQL) for the persistent application database
  - AWS security groups and subnet group for RDS

**Ansible** (in `infra/ansible/`)
- Playbook: `playbooks/deploy-devops-project.yml`
- Inventory: `inventory/hosts.ini`
- Automates post-Terraform deployment steps and configuration management

---

### Containerisation
- **Backend Dockerfile** (`server/Dockerfile`): Node.js 20 Alpine image serving the Express API on port 8080
- **Frontend Dockerfile** (`client/Dockerfile`): Multi-stage build → React build artefact served by Nginx on port 80; Nginx reverse-proxies `/api/*` to the backend service
- **Docker Compose** (`docker-compose.yml`): Local multi-container runtime for development

---

### Kubernetes Orchestration (in `k8s/`)
- Namespace: `devops-project`
- Backend Deployment (2 replicas) with readiness and liveness probes on `/api/health`
- Frontend Deployment (2 replicas) with Nginx serving the SPA
- ClusterIP Services for internal routing
- Ingress controller routing external traffic to the frontend; Nginx proxies `/api` calls to the backend
- HorizontalPodAutoscaler (HPA) for automatic scale-out under load

---

### Production Deployments

**Frontend → Vercel**
- The React SPA (`client/`) is deployed to Vercel for global CDN delivery.
- `vercel.json` defines the build command, output directory, and SPA rewrites.
- Environment variable `VITE_API_BASE_URL` points to the Render backend URL.

**Backend API → Render**
- The Node.js Express API (`server/`) is deployed to Render as a web service.
- `render.yaml` defines the service, build command (`npm ci`), start command (`npm start`), and environment variables.
- Environment variables: `PORT`, `GITHUB_TOKEN`, `MODEL_PROVIDER`, `MODEL_NAME`, `MODEL_API_KEY`, `MODEL_BASE_URL`, `DATABASE_URL`.

**Database → AWS RDS**
- PostgreSQL database provisioned on AWS RDS via Terraform.
- The Render backend connects to RDS using `DATABASE_URL`.
- RDS is in a private subnet, accessible only from the backend service.

---

### AI / Fine-Tuned Model
- The backend calls a **custom fine-tuned LLM** (e.g., a model fine-tuned on software engineering data and hosted at an OpenAI-compatible endpoint).
- Provider: `fine-tuned` (configured via `MODEL_PROVIDER=fine-tuned` in environment).
- The model endpoint base URL is set via `MODEL_BASE_URL`.
- The model name (fine-tuned model ID) is set via `MODEL_NAME`.
- The model analyses repository data and returns structured JSON: `summary`, `improvements`, `codeSuggestions`, `riskForecast`, `uniqueInsights`.
- If the model is unavailable, the backend falls back to static analysis results.

---

### Cloud Providers Summary
| Provider | Role |
|----------|------|
| **GitHub / GHCR** | Source control, CI/CD (GitHub Actions), Docker image registry |
| **AWS** | RDS PostgreSQL database, cloud infrastructure (via Terraform) |
| **Vercel** | Frontend (React SPA) hosting and CDN |
| **Render** | Backend (Node.js API) hosting |

---

Please produce a single Mermaid `graph TD` diagram that shows the full end-to-end flow from developer commit to live production across all the above layers. Use `subgraph` blocks to visually group: Source Control, CI/CD Pipeline, Docker & GHCR, Kubernetes Cluster, IaC (Terraform + Ansible), Production (Vercel + Render + AWS RDS), and the Fine-Tuned Model. Add brief labels on arrows to describe what is being passed or triggered at each step.
```
