variable "kubeconfig_path" {
  description = "Path to kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}

variable "namespace" {
  description = "Kubernetes namespace for Devops project"
  type        = string
  default     = "devops-project"
}

variable "server_image" {
  description = "Container image for backend"
  type        = string
  default     = "ghcr.io/owner/devops-project-server:latest"
}

variable "client_image" {
  description = "Container image for frontend"
  type        = string
  default     = "ghcr.io/owner/devops-project-client:latest"
}

variable "github_token" {
  description = "GitHub API token for server"
  type        = string
  sensitive   = true
  default     = ""
}

variable "model_api_key" {
  description = "Model provider API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "model_provider" {
  description = "Model provider (use 'finetuned' for a fine-tuned model served via an OpenAI-compatible endpoint)"
  type        = string
  default     = "finetuned"
}

variable "model_name" {
  description = "Fine-tuned model name, e.g. ft:gpt-4o:your-org:devops-analyzer:xxxx"
  type        = string
  default     = "ft:gpt-4o:your-org:devops-analyzer:xxxx"
}

variable "model_base_url" {
  description = "Base URL for the OpenAI-compatible fine-tuned model endpoint"
  type        = string
  default     = "https://api.openai.com/v1"
}
