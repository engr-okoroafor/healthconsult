import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';
import { CloudStorageService } from '../services/cloudStorageService';
import { DicomService } from '../services/dicomService';
import { DicomFile } from '../models/DicomFile';

const router = express.Router();
const storage = multer.memoryBuffer();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

const cloudStorage = new CloudStorageService();
const dicomService = new DicomService();

// Upload DICOM or medical images
router.post('/', auth, upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of files) {
      try {
        // Upload to Cloud Storage
        const gcsPath = await cloudStorage.uploadFile(file, 'medical-images');
        
        // Parse DICOM metadata if applicable
        let metadata = {};
        if (file.mimetype === 'application/dicom' || file.originalname.endsWith('.dcm')) {
          metadata = await dicomService.parseDicomMetadata(file.buffer);
        }

        // Create database record
        const dicomFile = new DicomFile({
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          gcsPath,
          uploadedBy: req.user.userId,
          patientId: metadata.patientId || null,
          studyId: metadata.studyId || null,
          seriesId: metadata.seriesId || null,
          modality: metadata.modality || null,
          bodyPart: metadata.bodyPart || null,
          metadata,
          uploadDate: new Date()
        });
        await dicomFile.save();

        uploadedFiles.push({
          id: dicomFile._id,
          fileName: dicomFile.fileName,
          fileSize: dicomFile.fileSize,
          gcsPath: dicomFile.gcsPath,
          metadata: dicomFile.metadata
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with other files
      }
    }

    res.json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get uploaded files
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, modality, patientId } = req.query;
    
    const filter: any = { uploadedBy: req.user.userId };
    if (modality) {
      filter.modality = modality;
    }
    if (patientId) {
      filter.patientId = patientId;
    }

    const files = await DicomFile.find(filter)
      .sort({ uploadDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await DicomFile.countDocuments(filter);

    res.json({
      files,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get file details
router.get('/:fileId', auth, async (req, res) => {
  try {
    const file = await DicomFile.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Generate signed URL for viewing
    const viewUrl = await cloudStorage.getSignedUrl(file.gcsPath);

    res.json({
      ...file.toObject(),
      viewUrl
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as uploadRoutes };