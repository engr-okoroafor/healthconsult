# Google Cloud Platform Deployment Guide

## Prerequisites

1. **Google Cloud SDK**: Install and configure the gcloud CLI
2. **Docker**: For building container images
3. **Terraform**: For infrastructure provisioning
4. **Node.js 18+**: For local development

## Step 1: Initial GCP Setup

### 1.1 Create and Configure GCP Project

```bash
# Set your project ID
export PROJECT_ID="medical-image-analysis"

# Create the project (if not already created)
gcloud projects create $PROJECT_ID

# Set the project as default
gcloud config set project $PROJECT_ID

# Enable billing (required for most services)
# Go to: https://console.cloud.google.com/billing
```

### 1.2 Enable Required APIs

```bash
# Enable all required Google Cloud APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com \
  healthcare.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com \
  container.googleapis.com
```

### 1.3 Create Service Account

```bash
# Create service account for deployment
gcloud iam service-accounts create medical-analysis-deploy \
  --display-name="Medical Analysis Deployment SA" \
  --description="Service account for deploying medical analysis application"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:medical-analysis-deploy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:medical-analysis-deploy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:medical-analysis-deploy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:medical-analysis-deploy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.admin"

# Create and download service account key
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account=medical-analysis-deploy@$PROJECT_ID.iam.gserviceaccount.com
```

## Step 2: Set Up Secrets

### 2.1 Create Secrets in Secret Manager

```bash
# MongoDB URI (replace with your actual MongoDB Atlas connection string)
echo -n "mongodb+srv://username:password@cluster.mongodb.net/medical-analysis" | \
  gcloud secrets create mongodb-uri --data-file=-

# Gemini API Key (get from Google AI Studio)
echo -n "your-actual-gemini-api-key" | \
  gcloud secrets create gemini-api-key --data-file=-

# JWT Secret (generate a secure random string)
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create jwt-secret --data-file=-
```

### 2.2 Verify Secrets

```bash
# List all secrets
gcloud secrets list

# Test secret access
gcloud secrets versions access latest --secret="mongodb-uri"
```

## Step 3: Infrastructure Deployment with Terraform

### 3.1 Initialize Terraform

```bash
cd infra

# Initialize Terraform
terraform init

# Create terraform.tfvars file
cat > terraform.tfvars << EOF
project_id  = "$PROJECT_ID"
region      = "us-central1"
environment = "production"
EOF
```

### 3.2 Plan and Apply Infrastructure

```bash
# Review the deployment plan
terraform plan

# Apply the infrastructure
terraform apply

# Note the outputs (backend_url, frontend_url, etc.)
terraform output
```

## Step 4: Build and Deploy Application

### 4.1 Configure Docker for Artifact Registry

```bash
# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 4.2 Build and Push Backend Image

```bash
# Navigate to project root
cd ..

# Build backend image
docker build -f backend/Dockerfile -t us-central1-docker.pkg.dev/$PROJECT_ID/medical-analysis/backend:latest ./backend

# Push backend image
docker push us-central1-docker.pkg.dev/$PROJECT_ID/medical-analysis/backend:latest
```

### 4.3 Build and Push Frontend Image

```bash
# Build frontend image
docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/medical-analysis/frontend:latest .

# Push frontend image
docker push us-central1-docker.pkg.dev/$PROJECT_ID/medical-analysis/frontend:latest
```

### 4.4 Deploy to Cloud Run

```bash
# Deploy backend service
gcloud run deploy medical-analysis-backend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/medical-analysis/backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID \
  --set-secrets MONGODB_URI=mongodb-uri:latest,GEMINI_API_KEY=gemini-api-key:latest,JWT_SECRET=jwt-secret:latest

# Get backend URL
BACKEND_URL=$(gcloud run services describe medical-analysis-backend --region=us-central1 --format='value(status.url)')

# Deploy frontend service
gcloud run deploy medical-analysis-frontend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/medical-analysis/frontend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars VITE_API_BASE_URL=$BACKEND_URL/api

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe medical-analysis-frontend --region=us-central1 --format='value(status.url)')

echo "Backend deployed at: $BACKEND_URL"
echo "Frontend deployed at: $FRONTEND_URL"
```

## Step 5: Configure Domain (Optional)

### 5.1 Set Up Custom Domain

```bash
# Map custom domain to Cloud Run service
gcloud run domain-mappings create \
  --service medical-analysis-frontend \
  --domain your-domain.com \
  --region us-central1
```

## Step 6: Set Up Monitoring and Logging

### 6.1 Enable Cloud Monitoring

```bash
# Cloud Monitoring is enabled by default
# Access at: https://console.cloud.google.com/monitoring

# Set up alerting policies
gcloud alpha monitoring policies create --policy-from-file=monitoring-policy.yaml
```

### 6.2 Configure Log-based Metrics

```bash
# Create log-based metrics for application monitoring
gcloud logging metrics create error_rate \
  --description="Application error rate" \
  --log-filter='resource.type="cloud_run_revision" AND severity>=ERROR'
```

## Step 7: Set Up CI/CD (GitHub Actions)

### 7.1 Configure GitHub Secrets

In your GitHub repository, add these secrets:

- `GCP_SA_KEY`: Content of service-account-key.json
- `GCP_PROJECT_ID`: Your project ID
- `MONGODB_URI`: Your MongoDB connection string
- `GEMINI_API_KEY`: Your Gemini API key

### 7.2 GitHub Actions Workflow

The workflow is already configured in `.github/workflows/deploy.yml`. It will:

1. Run tests on pull requests
2. Build and deploy on pushes to main branch
3. Update infrastructure with Terraform

## Step 8: Verify Deployment

### 8.1 Test Backend API

```bash
# Test health endpoint
curl $BACKEND_URL/health

# Test authentication
curl -X POST $BACKEND_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"password123"}'
```

### 8.2 Test Frontend

```bash
# Open frontend in browser
open $FRONTEND_URL

# Or test with curl
curl -I $FRONTEND_URL
```

## Step 9: Production Considerations

### 9.1 Security Hardening

```bash
# Enable VPC for Cloud Run (optional)
gcloud compute networks create medical-analysis-vpc --subnet-mode regional

# Set up Cloud Armor for DDoS protection
gcloud compute security-policies create medical-analysis-policy
```

### 9.2 Backup and Disaster Recovery

```bash
# Set up automated backups for MongoDB Atlas
# Configure in MongoDB Atlas dashboard

# Set up Cloud Storage lifecycle policies
gsutil lifecycle set lifecycle.json gs://your-bucket-name
```

### 9.3 Performance Optimization

```bash
# Enable Cloud CDN for static assets
gcloud compute backend-buckets create medical-analysis-cdn \
  --gcs-bucket-name=your-static-assets-bucket

# Set up load balancing
gcloud compute url-maps create medical-analysis-lb \
  --default-service=medical-analysis-backend
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure service account has correct IAM roles
2. **API Not Enabled**: Run the enable APIs command again
3. **Secret Access**: Verify secrets exist and service account has access
4. **Memory Limits**: Increase Cloud Run memory allocation if needed

### Useful Commands

```bash
# View Cloud Run logs
gcloud run services logs read medical-analysis-backend --region=us-central1

# Check service status
gcloud run services describe medical-analysis-backend --region=us-central1

# Update environment variables
gcloud run services update medical-analysis-backend \
  --region=us-central1 \
  --set-env-vars NEW_VAR=value

# Scale service
gcloud run services update medical-analysis-backend \
  --region=us-central1 \
  --max-instances=20
```

## Cost Optimization

1. **Set up billing alerts**: Configure in Cloud Console
2. **Use preemptible instances**: For non-critical workloads
3. **Optimize container images**: Use multi-stage builds
4. **Monitor usage**: Regular review of Cloud Monitoring dashboards

## Support

- **Documentation**: https://cloud.google.com/docs
- **Support**: https://cloud.google.com/support
- **Community**: https://stackoverflow.com/questions/tagged/google-cloud-platform