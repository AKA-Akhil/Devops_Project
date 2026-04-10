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
   - Value: your fine-tuned model API key (e.g., OpenAI API key).
8. Add repository variable for deploy control:
   - Go to **Settings** -> **Secrets and variables** -> **Actions** -> **Variables**.
   - Click **New repository variable**.
   - Name: `ENABLE_K8S_DEPLOY`
   - Value: `false`
9. Add deploy runner mode variable:
   - Click **New repository variable**.
   - Name: `DEPLOY_RUNNER`
   - Value: `self-hosted` (for your local Minikube)

PowerShell command for kubeconfig base64:

`[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME/.kube/config"))`

## 3. Run CI/CD pipeline

1. Open GitHub repo.
2. Click **Actions** tab.
3. Click workflow named **Devops project CI CD Pipeline**.
4. Click **Run workflow** button.
5. Select branch `main`.
6. Click green **Run workflow**.

Expected result with beginner setup: Build and Test and Docker Build and Push pass, while Deploy to Kubernetes is skipped.

## 3A. Enable self-hosted runner (required for local Minikube deploy from Actions)

1. Open your GitHub repository page.
2. Click **Settings**.
3. Left menu: click **Actions** -> **Runners**.
4. Click **New self-hosted runner**.
5. Select platform **Windows** and architecture **x64**.
6. Follow shown commands in PowerShell exactly.
    - Example flow from GitHub page:
       - `mkdir actions-runner; cd actions-runner`
       - `Invoke-WebRequest -Uri <runner-zip-url> -OutFile actions-runner-win-x64.zip`
       - `Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-x64.zip", "$PWD")`
       - `./config.cmd --url https://github.com/<your-username>/Devops_Project --token <token-from-github-page>`
       - `./run.cmd`

Keep that runner PowerShell window open while workflow runs.

## 3B. Turn on deploy stage

1. Go to **Settings** -> **Secrets and variables** -> **Actions** -> **Variables**.
2. Edit `ENABLE_K8S_DEPLOY` and set value to `true`.
3. Ensure `DEPLOY_RUNNER` is `self-hosted`.
4. Run workflow from **Actions** tab again.

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
3. Edit `terraform.tfvars` and put real values (including AWS credentials and RDS settings).
4. Run:
   - `terraform init`
   - `terraform plan`
   - `terraform apply -auto-approve`
5. After apply, copy the `rds_endpoint` output value and set it as `DATABASE_URL` in your Render environment.

## 7. Ansible deployment

1. Install ansible and kubernetes collection.
2. In `infra/ansible`, run:
   - `ansible-galaxy collection install -r requirements.yml`
   - `ansible-playbook -i inventory/hosts.ini playbooks/deploy-devops-project.yml`

## 8. Deploy frontend to Vercel

1. Sign in at https://vercel.com.
2. Click **Add New Project** and import the GitHub repository.
3. Set **Root Directory** to `client`.
4. Vercel auto-detects Vite; build command: `npm run build`, output: `dist`.
5. Add environment variable `VITE_API_BASE_URL` pointing to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).
6. Click **Deploy**.

## 9. Deploy backend to Render

1. Sign in at https://render.com.
2. Click **New** -> **Web Service** and connect the GitHub repository.
3. Render detects `render.yaml` automatically and pre-fills the settings.
4. Set the following environment variables (marked `sync: false` in `render.yaml`):
   - `GITHUB_TOKEN` — your GitHub fine-grained token
   - `MODEL_NAME` — your fine-tuned model ID (e.g., `ft:gpt-4o-mini:your-org:devops-project:abc123`)
   - `MODEL_API_KEY` — your API key
   - `MODEL_BASE_URL` — API base URL (e.g., `https://api.openai.com/v1`)
   - `DATABASE_URL` — PostgreSQL connection string from AWS RDS (`rds_endpoint` Terraform output)
5. Click **Create Web Service**.

