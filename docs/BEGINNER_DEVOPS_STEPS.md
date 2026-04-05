# Devops project Beginner Steps

This file gives exact click-by-click instructions.

## 1. Create GitHub repository (if not already pushed)

1. Open https://github.com and sign in.
2. Click top-right **+** button.
3. Click **New repository**.
4. Repository name: `Devops_Project`.
5. Click **Create repository**.
6. In VS Code terminal at project root, type:
   - `git add .`
   - `git commit -m "feat: add devops project automation"`
   - `git branch -M main`
   - `git remote add origin https://github.com/<your-username>/Devops_Project.git`
   - `git push -u origin main`

## 2. Configure GitHub Actions secrets

1. Open your GitHub repo page.
2. Click **Settings** tab.
3. In left menu, click **Secrets and variables**.
4. Click **Actions**.
5. Click **New repository secret** and add each:
   - Name: `KUBE_CONFIG_DATA`
   - Value: output of `cat ~/.kube/config | base64 -w 0` (Linux/macOS) or PowerShell command below.
6. Add another secret:
   - Name: `DEVOPS_PROJECT_GITHUB_TOKEN`
   - Value: your GitHub fine-grained token.
7. Add another secret:
   - Name: `DEVOPS_PROJECT_MODEL_API_KEY`
   - Value: your model provider key.

PowerShell command for kubeconfig base64:

`[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME/.kube/config"))`

## 3. Run CI/CD pipeline

1. Open GitHub repo.
2. Click **Actions** tab.
3. Click workflow named **Devops project CI CD Pipeline**.
4. Click **Run workflow** button.
5. Select branch `main`.
6. Click green **Run workflow**.

## 4. Local Docker deployment

In VS Code terminal (project root), type:

- `docker compose up --build -d`
- Open browser: `http://localhost:5173`
- API health: `http://localhost:8080/api/health`

To stop:

- `docker compose down`

## 5. Kubernetes deployment (local)

Install one local cluster tool:

- Option A: Docker Desktop Kubernetes (easy)
  - Open Docker Desktop.
  - Click **Settings**.
  - Click **Kubernetes**.
  - Check **Enable Kubernetes**.
  - Click **Apply & Restart**.
- Option B: Minikube.

Then deploy:

- `kubectl apply -f k8s`
- `kubectl get pods -n devops-project`
- `kubectl get svc -n devops-project`

If using ingress with local host mapping, add to hosts file:

- `127.0.0.1 devops-project.local`

## 6. Terraform IaC apply

1. Go to terraform folder:
   - `cd infra/terraform`
2. Copy variables example:
   - PowerShell: `Copy-Item terraform.tfvars.example terraform.tfvars`
3. Edit `terraform.tfvars` and put real values.
4. Run:
   - `terraform init`
   - `terraform plan`
   - `terraform apply -auto-approve`

## 7. Ansible deployment

1. Install ansible and kubernetes collection.
2. In `infra/ansible`, run:
   - `ansible-galaxy collection install -r requirements.yml`
   - `ansible-playbook -i inventory/hosts.ini playbooks/deploy-devops-project.yml`
