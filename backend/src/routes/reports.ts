import express from 'express';
import { auth } from '../middleware/auth';
import { GeminiService } from '../services/geminiService';
import { Report } from '../models/Report';
import { Analysis } from '../models/Analysis';

const router = express.Router();
const gemini = new GeminiService();

// Generate report from analysis
router.post('/generate', auth, async (req, res) => {
  try {
    const { analysisId, template = 'standard', includeImages = true } = req.body;

    // Find the analysis
    const analysis = await Analysis.findById(analysisId)
      .populate('dicomFileId')
      .populate('userId');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (analysis.status !== 'completed') {
      return res.status(400).json({ message: 'Analysis not completed yet' });
    }

    // Generate report using Gemini
    const reportContent = await gemini.generateReport(analysis, template);

    // Create report record
    const report = new Report({
      analysisId,
      userId: req.user.userId,
      patientId: analysis.dicomFileId.patientId,
      title: `${analysis.dicomFileId.modality} Analysis Report`,
      content: reportContent,
      template,
      status: 'draft',
      createdAt: new Date(),
      lastModified: new Date()
    });
    await report.save();

    res.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get report by ID
router.get('/:reportId', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate('analysisId')
      .populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update report
router.put('/:reportId', auth, async (req, res) => {
  try {
    const { content, status } = req.body;

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user can edit this report
    if (report.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    report.content = content || report.content;
    report.status = status || report.status;
    report.lastModified = new Date();
    await report.save();

    res.json(report);
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// List reports
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    
    const filter: any = {};
    if (req.user.role !== 'admin') {
      filter.userId = req.user.userId;
    }
    if (status) {
      filter.status = status;
    }
    if (patientId) {
      filter.patientId = patientId;
    }

    const reports = await Report.find(filter)
      .populate('analysisId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as reportsRoutes };