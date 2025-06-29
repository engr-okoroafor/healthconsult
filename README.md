# Smart Medical Image Analysis & Reporting Assistant

A comprehensive AI-powered platform for medical image analysis, automated reporting, and clinical decision support. Built with React, Node.js, and Google Cloud Platform.

## 🏥 Features

### Core Functionality
- **DICOM Image Upload & Viewer**: Drag-and-drop interface with DICOM metadata parsing
- **AI-Powered Analysis**: Vertex AI integration for automated medical image analysis
- **Automated Report Generation**: Gemini AI-powered structured radiology reports
- **RAG-Powered Chatbot**: Intelligent assistant for case queries and similar case searches
- **Real-time Dashboard**: Analysis status tracking and workflow management
- **Role-based Access Control**: Secure authentication with radiologist/admin roles

### Technical Features
- **Glassmorphic UI**: Modern, responsive design with medical theme
- **Cloud-Native Architecture**: Microservices deployed on Google Cloud Run
- **HIPAA-Compliant Storage**: Encrypted data storage with audit logging
- **Vector Search**: Semantic similarity search for case comparisons
- **Multi-modal AI**: Integration with multiple AI models for specialized analysis

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Node.js API   │    │  Google Cloud   │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ├─ Vertex AI
         │                       │                       ├─ Cloud Storage
         │                       │                       ├─ Healthcare API
         │                       │                       └─ Secret Manager
         │                       │
         │              ┌─────────────────┐
         │              │   MongoDB       │
         └──────────────┤   Atlas         │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Cloud SDK
- Terraform
- MongoDB Atlas account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/medical-image-analysis.git
   cd medical-image-analysis
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   # Edit .env files with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend && npm install
   ```

4. **Start development servers**
   ```bash
   # Frontend (port 5173)
   npm run dev
   
   # Backend (port 3001)
   cd backend && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Demo credentials: `doctor@hospital.com` / `password123`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medical-image-analysis
```

#### Backend (backend/.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-analysis
GOOGLE_CLOUD_PROJECT_ID=medical-image-analysis
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
VERTEX_AI_LOCATION=us-central1
GEMINI_API_KEY=your_gemini_api_key
DICOM_STORE_ID=medical-dicom-store
HEALTHCARE_DATASET_ID=medical-dataset
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

## 🏗️ Infrastructure Setup

### 1. Google Cloud Platform Setup

```bash
# Set up GCP project
gcloud projects create medical-image-analysis
gcloud config set project medical-image-analysis

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com \
  healthcare.googleapis.com \
  aiplatform.googleapis.com
```

### 2. Terraform Deployment

```bash
cd infra

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="project_id=medical-image-analysis"

# Apply infrastructure
terraform apply -var="project_id=medical-image-analysis"
```

### 3. Set up Secrets

```bash
# MongoDB URI
echo -n "mongodb+srv://..." | gcloud secrets create mongodb-uri --data-file=-

# Gemini API Key
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-

# JWT Secret
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
```

## 🚢 Deployment

### Automated Deployment (GitHub Actions)

1. **Set up GitHub Secrets**
   - `GCP_SA_KEY`: Service account key JSON
   - Add other required secrets

2. **Push to main branch**
   ```bash
   git push origin main
   ```

### Manual Deployment

```bash
# Build and push containers
docker build -t gcr.io/medical-image-analysis/frontend .
docker build -t gcr.io/medical-image-analysis/backend ./backend

docker push gcr.io/medical-image-analysis/frontend
docker push gcr.io/medical-image-analysis/backend

# Deploy to Cloud Run
gcloud run deploy medical-analysis-frontend \
  --image gcr.io/medical-image-analysis/frontend \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy medical-analysis-backend \
  --image gcr.io/medical-image-analysis/backend \
  --region us-central1 \
  --allow-unauthenticated
```

## 🧪 Testing

```bash
# Frontend tests
npm run test
npm run lint

# Backend tests
cd backend
npm run test
npm run lint

# E2E tests
npm run test:e2e
```

## 📊 Monitoring & Logging

- **Application Logs**: Cloud Logging
- **Metrics**: Cloud Monitoring
- **Alerts**: Cloud Alerting
- **Tracing**: Cloud Trace
- **Error Reporting**: Cloud Error Reporting

## 🔒 Security & Compliance

### HIPAA Compliance Features
- **Encryption**: All data encrypted in transit and at rest
- **Access Controls**: Role-based authentication and authorization
- **Audit Logging**: Comprehensive audit trails for all data access
- **Data Retention**: Configurable retention policies
- **Secure Communication**: TLS 1.3 for all communications

### Security Best Practices
- Container security scanning
- Dependency vulnerability scanning
- Secret management with Google Secret Manager
- Network security with VPC and firewall rules
- Regular security updates and patches

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/medical-image-analysis/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/medical-image-analysis/discussions)

## 🙏 Acknowledgments

- Google Cloud Platform for AI/ML services
- MongoDB Atlas for database hosting
- React and Node.js communities
- Medical imaging community for requirements and feedback

---

**⚠️ Important**: This is a demonstration platform. For production medical use, ensure proper validation, regulatory compliance, and clinical oversight.