output "namespace" {
  value = kubernetes_namespace.devops_project.metadata[0].name
}

output "server_service" {
  value = kubernetes_service_v1.server.metadata[0].name
}

output "client_service" {
  value = kubernetes_service_v1.client.metadata[0].name
}
