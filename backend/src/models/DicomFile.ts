import mongoose, { Document, Schema } from 'mongoose';

export interface IDicomFile extends Document {
  fileName: string;
  fileSize: number;
  mimeType: string;
  gcsPath: string;
  uploadedBy: mongoose.Types.ObjectId;
  patientId?: string;
  studyId?: string;
  seriesId?: string;
  modality?: string;
  bodyPart?: string;
  metadata: Record<string, any>;
  uploadDate: Date;
}

const dicomFileSchema = new Schema<IDicomFile>({
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  gcsPath: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: String,
    index: true
  },
  studyId: {
    type: String,
    index: true
  },
  seriesId: {
    type: String,
    index: true
  },
  modality: {
    type: String,
    index: true
  },
  bodyPart: {
    type: String,
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  uploadDate: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound indexes for common queries
dicomFileSchema.index({ uploadedBy: 1, uploadDate: -1 });
dicomFileSchema.index({ patientId: 1, modality: 1 });

export const DicomFile = mongoose.model<IDicomFile>('DicomFile', dicomFileSchema);