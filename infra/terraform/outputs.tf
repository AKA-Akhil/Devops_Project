output "namespace" {
  value = kubernetes_namespace.devops_project.metadata[0].name
}

output "server_service" {
  value = kubernetes_service_v1.server.metadata[0].name
}

output "client_service" {
  value = kubernetes_service_v1.client.metadata[0].name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint for use as DATABASE_URL"
  value       = aws_db_instance.devops_project.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "Database name on the RDS instance"
  value       = aws_db_instance.devops_project.db_name
}
