export interface DicomFile {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  patientId?: string;
  studyId?: string;
  seriesId?: string;
  modality?: string;
  bodyPart?: string;
  url?: string;
  thumbnailUrl?: string;
}

export interface AnalysisResult {
  id: string;
  dicomFileId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  findings: Finding[];
  confidence: number;
  processingTime: number;
  createdAt: Date;
  segmentationMask?: string;
  aiModel: string;
}

export interface Finding {
  id: string;
  type: string;
  description: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

export interface Report {
  id: string;
  analysisId: string;
  patientId: string;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'finalized';
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  template: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  context?: any;
}