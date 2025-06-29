import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  analysisId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  patientId: string;
  title: string;
  content: string;
  template: string;
  status: 'draft' | 'review' | 'finalized';
  createdAt: Date;
  lastModified: Date;
}

const reportSchema = new Schema<IReport>({
  analysisId: {
    type: Schema.Types.ObjectId,
    ref: 'Analysis',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  template: {
    type: String,
    required: true,
    default: 'standard'
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'review', 'finalized'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Indexes for common queries
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ patientId: 1, status: 1 });
reportSchema.index({ analysisId: 1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);