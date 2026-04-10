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
  description = "Model provider (fine-tuned or gemini)"
  type        = string
  default     = "fine-tuned"
}

variable "model_name" {
  description = "Fine-tuned model ID or model name"
  type        = string
  default     = "ft:gpt-4o-mini:your-org:devops-project:abc123"
}

variable "model_base_url" {
  description = "Base URL for the model API endpoint (OpenAI-compatible)"
  type        = string
  default     = "https://api.openai.com/v1"
}

# AWS variables

variable "aws_region" {
  description = "AWS region for RDS and other resources"
  type        = string
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "VPC ID where RDS will be deployed"
  type        = string
  default     = ""
}

variable "db_subnet_ids" {
  description = "List of subnet IDs for the RDS subnet group"
  type        = list(string)
  default     = []
}

variable "backend_cidr_blocks" {
  description = "CIDR blocks allowed to reach RDS (backend service IPs)"
  type        = list(string)
  default     = []
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS instance in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Name of the database to create"
  type        = string
  default     = "devops_project"
}

variable "db_username" {
  description = "Master username for RDS"
  type        = string
  default     = "devops_admin"
}

variable "db_password" {
  description = "Master password for RDS"
  type        = string
  sensitive   = true
  default     = ""
}

variable "db_engine_version" {
  description = "PostgreSQL engine version for RDS"
  type        = string
  default     = "15"
}

variable "db_skip_final_snapshot" {
  description = "Skip final snapshot when deleting the RDS instance. Set to false in production to retain a backup."
  type        = bool
  default     = false
}
