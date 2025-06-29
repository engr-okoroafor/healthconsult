import mongoose, { Document, Schema } from 'mongoose';

export interface IFinding {
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

export interface IAnalysis extends Document {
  dicomFileId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  findings: IFinding[];
  confidence: number;
  processingTime?: number;
  modelType: string;
  sensitivity: string;
  segmentationMask?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

const findingSchema = new Schema<IFinding>({
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  }
});

const analysisSchema = new Schema<IAnalysis>({
  dicomFileId: {
    type: Schema.Types.ObjectId,
    ref: 'DicomFile',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  findings: [findingSchema],
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  processingTime: {
    type: Number
  },
  modelType: {
    type: String,
    required: true,
    default: 'general'
  },
  sensitivity: {
    type: String,
    required: true,
    default: 'standard'
  },
  segmentationMask: {
    type: String
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  completedAt: {
    type: Date
  }
});

// Indexes for common queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ dicomFileId: 1 });
analysisSchema.index({ status: 1 });

export const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);