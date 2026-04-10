# Claude Prompt: Generate Project Architecture Flowchart

Copy the prompt below and paste it directly into Claude to generate a Mermaid flowchart
for the Devops project architecture.

---

## Prompt

```
Generate a detailed Mermaid flowchart diagram for a full-stack DevOps project called
"DevOps Project" — a Repository Intelligence application. The diagram must show every
stage of the end-to-end lifecycle, from developer commit to live production, and must
include ALL of the following tools and platforms:

**Source Control & Collaboration**
- GitHub repository (main / develop / feature branches)
- Pull Request review + merge workflow

**CI/CD Pipeline — GitHub Actions**
- Trigger: push to main or develop, or pull request to main
- Stage 1 – Build & Test:
  - Install Node.js dependencies (server + client)
  - Run backend unit tests (Jest)
  - Build React/Vite frontend (npm run build)
- Stage 2 – Docker Build & Push:
  - Build backend Docker image (server/Dockerfile)
  - Build frontend Docker image with Nginx (client/Dockerfile)
  - Push both images to GitHub Container Registry (GHCR)
- Stage 3 – Deploy:
  - Apply Kubernetes manifests via kubectl
  - Rolling update of server and client deployments
  - Wait for rollout health checks

**Containerisation**
- Docker (multi-stage builds for server and client)
- Docker Compose (local multi-container development)

**Orchestration**
- Kubernetes cluster (Namespace, ConfigMap, Secrets, Deployments, Services, Ingress, HPA)
- Two deployment paths shown: github-hosted runner and self-hosted runner

**Infrastructure as Code**
- Terraform: provisions Kubernetes namespace, ConfigMap, Secrets, Deployments, Services
- Ansible: automation playbook that applies K8s manifests for deployment

**Deployment Targets**
- Frontend: Vercel (automatic deploy from GitHub; serves the React/Vite static build)
- Backend API: Render (Docker-based deployment of the Express.js server)
- Kubernetes orchestration layer: AWS EKS (hosts the containerised workloads)
- Database: AWS (RDS or DynamoDB for persistent data storage)

**AI / ML Layer**
- Fine-tuned model (custom fine-tuned LLM served via an OpenAI-compatible endpoint)
  replaces any generic API (e.g., do NOT show Gemini)
- The fine-tuned model powers the Repository Intelligence analysis feature
- API key and model name are injected as Kubernetes Secrets at deploy time

**Monitoring & Feedback**
- Health-check probes on /api/health (readiness + liveness)
- HPA (Horizontal Pod Autoscaler) scales pods based on CPU load

Diagram requirements:
1. Use Mermaid `flowchart TD` syntax.
2. Organise nodes into clearly labelled subgraphs:
   - DEV (Developer Workstation)
   - VCS (GitHub Version Control)
   - CICD (GitHub Actions Pipeline)
   - CONTAINERS (Docker / GHCR)
   - IAC (Terraform + Ansible)
   - K8S (Kubernetes / AWS EKS)
   - DEPLOY_FE (Vercel — Frontend)
   - DEPLOY_BE (Render — Backend API)
   - DB (AWS Database)
   - AI (Fine-tuned Model)
3. Use colour-coded styles:
   - GitHub Actions nodes: light blue
   - Docker/container nodes: light cyan
   - Kubernetes nodes: light green
   - AWS nodes: orange
   - Vercel nodes: black fill with white text
   - Render nodes: purple
   - Fine-tuned model node: gold
   - Terraform nodes: dark purple
   - Ansible nodes: red
4. Add clear directional arrows with short labels (e.g., "push", "trigger", "build",
   "push image", "apply manifests", "deploy", "query", "infer").
5. The diagram should be self-contained and renderable in any Mermaid-compatible viewer
   (e.g., mermaid.live, GitHub markdown, or VS Code Mermaid extension).
6. After the diagram block, include a short legend table mapping each subgraph to its
   purpose and the tool(s) it represents.
```
