# Devops project Rubric Mapping

## Version Control and Collaboration

- Branch strategy documented in `docs/GIT_WORKFLOW.md`.
- PR template in `.github/PULL_REQUEST_TEMPLATE.md`.
- Bug and feature issue templates in `.github/ISSUE_TEMPLATE/`.

## CI/CD Pipeline Implementation

- Full build, test, docker build/push, deploy pipeline in `.github/workflows/devops-project-cicd.yml`.
- Automated quality gates:
  - Server tests (`npm test`)
  - Client build checks (`npm run build`)

## Containerization and Deployment

- Backend Docker image: `server/Dockerfile`.
- Frontend Docker image + Nginx reverse proxy: `client/Dockerfile`, `client/nginx.conf`.
- Local multi-service runtime: `docker-compose.yml`.
- Orchestration: Kubernetes manifests in `k8s/`.

## Infrastructure as Code (IaC)

- Terraform-based reproducible infrastructure in `infra/terraform/`.
- Ansible-based deployment automation in `infra/ansible/`.
