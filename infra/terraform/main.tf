provider "kubernetes" {
  config_path = var.kubeconfig_path
}

resource "kubernetes_namespace" "devops_project" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_config_map_v1" "app_config" {
  metadata {
    name      = "devops-project-config"
    namespace = kubernetes_namespace.devops_project.metadata[0].name
  }

  data = {
    PORT           = "8080"
    MODEL_PROVIDER = var.model_provider
    MODEL_NAME     = var.model_name
  }
}

resource "kubernetes_secret_v1" "app_secrets" {
  metadata {
    name      = "devops-project-secrets"
    namespace = kubernetes_namespace.devops_project.metadata[0].name
  }

  string_data = {
    GITHUB_TOKEN = var.github_token
    MODEL_API_KEY = var.model_api_key
  }

  type = "Opaque"
}

resource "kubernetes_deployment_v1" "server" {
  metadata {
    name      = "devops-project-server"
    namespace = kubernetes_namespace.devops_project.metadata[0].name
    labels = {
      app = "devops-project-server"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "devops-project-server"
      }
    }

    template {
      metadata {
        labels = {
          app = "devops-project-server"
        }
      }

      spec {
        container {
          name  = "devops-project-server"
          image = var.server_image

          port {
            container_port = 8080
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map_v1.app_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret_v1.app_secrets.metadata[0].name
            }
          }

          readiness_probe {
            http_get {
              path = "/api/health"
              port = 8080
            }
            initial_delay_seconds = 8
            period_seconds        = 10
          }

          liveness_probe {
            http_get {
              path = "/api/health"
              port = 8080
            }
            initial_delay_seconds = 20
            period_seconds        = 20
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "server" {
  metadata {
    name      = "devops-project-server"
    namespace = kubernetes_namespace.devops_project.metadata[0].name
  }

  spec {
    selector = {
      app = "devops-project-server"
    }

    port {
      port        = 8080
      target_port = 8080
    }
  }
}

resource "kubernetes_deployment_v1" "client" {
  metadata {
    name      = "devops-project-client"
    namespace = kubernetes_namespace.devops_project.metadata[0].name
    labels = {
      app = "devops-project-client"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "devops-project-client"
      }
    }

    template {
      metadata {
        labels = {
          app = "devops-project-client"
        }
      }

      spec {
        container {
          name  = "devops-project-client"
          image = var.client_image

          port {
            container_port = 80
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 5
            period_seconds        = 10
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "client" {
  metadata {
    name      = "devops-project-client"
    namespace = kubernetes_namespace.devops_project.metadata[0].name
  }

  spec {
    selector = {
      app = "devops-project-client"
    }

    port {
      port        = 80
      target_port = 80
    }

    type = "LoadBalancer"
  }
}
