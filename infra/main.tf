terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "medical-image-analysis"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "storage.googleapis.com",
    "healthcare.googleapis.com",
    "aiplatform.googleapis.com",
    "secretmanager.googleapis.com"
  ])
  
  project = var.project_id
  service = each.value
  
  disable_dependent_services = true
}

# Artifact Registry for container images
resource "google_artifact_registry_repository" "medical_analysis" {
  location      = var.region
  repository_id = "medical-analysis"
  description   = "Container registry for medical image analysis application"
  format        = "DOCKER"
  
  depends_on = [google_project_service.apis]
}

# Cloud Storage bucket for medical images
resource "google_storage_bucket" "medical_images" {
  name          = "${var.project_id}-medical-images-${var.environment}"
  location      = var.region
  force_destroy = false
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
  
  encryption {
    default_kms_key_name = google_kms_crypto_key.medical_data_key.id
  }
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
  
  depends_on = [google_project_service.apis]
}

# Cloud Storage bucket for analysis results
resource "google_storage_bucket" "analysis_results" {
  name          = "${var.project_id}-analysis-results-${var.environment}"
  location      = var.region
  force_destroy = false
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
  
  encryption {
    default_kms_key_name = google_kms_crypto_key.medical_data_key.id
  }
  
  depends_on = [google_project_service.apis]
}

# KMS key for encryption
resource "google_kms_key_ring" "medical_analysis" {
  name     = "medical-analysis-keyring"
  location = var.region
}

resource "google_kms_crypto_key" "medical_data_key" {
  name     = "medical-data-key"
  key_ring = google_kms_key_ring.medical_analysis.id
  
  lifecycle {
    prevent_destroy = true
  }
}

# Service Account for Cloud Run services
resource "google_service_account" "cloud_run_sa" {
  account_id   = "medical-analysis-run-sa"
  display_name = "Medical Analysis Cloud Run Service Account"
  description  = "Service account for Cloud Run services"
}

# IAM bindings for service account
resource "google_project_iam_member" "cloud_run_permissions" {
  for_each = toset([
    "roles/storage.objectAdmin",
    "roles/healthcare.datasetAdmin",
    "roles/aiplatform.user",
    "roles/secretmanager.secretAccessor"
  ])
  
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Cloud Run service for backend API
resource "google_cloud_run_v2_service" "backend_api" {
  name     = "medical-analysis-backend"
  location = var.region
  
  template {
    service_account = google_service_account.cloud_run_sa.email
    
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
    
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/medical-analysis/backend:latest"
      
      ports {
        container_port = 3001
      }
      
      env {
        name  = "NODE_ENV"
        value = var.environment
      }
      
      env {
        name = "MONGODB_URI"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.mongodb_uri.secret_id
            version = "latest"
          }
        }
      }
      
      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_api_key.secret_id
            version = "latest"
          }
        }
      }
      
      env {
        name  = "GOOGLE_CLOUD_PROJECT_ID"
        value = var.project_id
      }
      
      env {
        name  = "GCS_BUCKET_NAME"
        value = google_storage_bucket.medical_images.name
      }
      
      resources {
        limits = {
          cpu    = "2"
          memory = "4Gi"
        }
      }
    }
  }
  
  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.medical_analysis
  ]
}

# Cloud Run service for frontend
resource "google_cloud_run_v2_service" "frontend" {
  name     = "medical-analysis-frontend"
  location = var.region
  
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/medical-analysis/frontend:latest"
      
      ports {
        container_port = 80
      }
      
      env {
        name  = "VITE_API_BASE_URL"
        value = google_cloud_run_v2_service.backend_api.uri
      }
    }
  }
  
  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.medical_analysis
  ]
}

# IAM policy for Cloud Run services (allow public access)
resource "google_cloud_run_service_iam_member" "backend_public" {
  location = google_cloud_run_v2_service.backend_api.location
  project  = google_cloud_run_v2_service.backend_api.project
  service  = google_cloud_run_v2_service.backend_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  project  = google_cloud_run_v2_service.frontend.project
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Secret Manager secrets
resource "google_secret_manager_secret" "mongodb_uri" {
  secret_id = "mongodb-uri"
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "gemini-api-key"
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "jwt-secret"
  
  replication {
    auto {}
  }
}

# Healthcare API dataset for DICOM storage
resource "google_healthcare_dataset" "medical_dataset" {
  name     = "medical-dataset"
  location = var.region
}

resource "google_healthcare_dicom_store" "medical_dicom_store" {
  name    = "medical-dicom-store"
  dataset = google_healthcare_dataset.medical_dataset.id
}

# Outputs
output "backend_url" {
  description = "Backend API URL"
  value       = google_cloud_run_v2_service.backend_api.uri
}

output "frontend_url" {
  description = "Frontend URL"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "artifact_registry_url" {
  description = "Artifact Registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/medical-analysis"
}

output "medical_images_bucket" {
  description = "Medical images storage bucket"
  value       = google_storage_bucket.medical_images.name
}

output "healthcare_dataset_id" {
  description = "Healthcare dataset ID"
  value       = google_healthcare_dataset.medical_dataset.id
}