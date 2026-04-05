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
  description = "Model provider"
  type        = string
  default     = "gemini"
}

variable "model_name" {
  description = "Model name"
  type        = string
  default     = "gemini-2.0-flash"
}
