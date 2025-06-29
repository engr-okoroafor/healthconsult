import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileImage, 
  X, 
  Play, 
  Loader,
  Eye,
  Download,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ApiService } from '../services/apiService';
import { useAsyncAction } from '../hooks/useApi';

const UploadAnalysis: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [modelType, setModelType] = useState('general');
  const [sensitivity, setSensitivity] = useState('standard');

  const { execute: uploadFiles, loading: uploading, error: uploadError } = useAsyncAction();
  const { execute: startAnalysis, loading: analyzing, error: analysisError } = useAsyncAction();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/dicom': ['.dcm'],
      'image/*': ['.jpg', '.jpeg', '.png', '.bmp']
    },
    onDrop: async (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      
      // Upload files to backend
      const result = await uploadFiles(() => ApiService.uploadFiles(acceptedFiles));
      if (result?.files) {
        setUploadedFileIds(prev => [...prev, ...result.files.map((f: any) => f.id)]);
      }
    }
  });

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(files => files.filter((_, index) => index !== indexToRemove));
    setUploadedFileIds(ids => ids.filter((_, index) => index !== indexToRemove));
  };

  const handleStartAnalysis = async () => {
    if (uploadedFileIds.length === 0) return;

    const result = await startAnalysis(() => 
      ApiService.startAnalysis({
        dicomFileId: uploadedFileIds[0], // Use first file for demo
        modelType,
        sensitivity
      })
    );

    if (result) {
      setAnalysisId(result.analysisId);
      // Poll for results
      pollAnalysisResults(result.analysisId);
    }
  };

  const pollAnalysisResults = async (id: string) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const result = await ApiService.getAnalysis(id);
        
        if (result.status === 'completed') {
          setAnalysisResults(result);
          return;
        } else if (result.status === 'failed') {
          setAnalysisResults({ error: result.error || 'Analysis failed' });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setAnalysisResults({ error: 'Analysis timeout' });
        }
      } catch (error) {
        console.error('Polling error:', error);
        setAnalysisResults({ error: 'Failed to get analysis results' });
      }
    };

    poll();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-medical-dark mb-2">Upload & Analysis</h1>
        <p className="text-gray-600">Upload medical images for AI-powered analysis and diagnosis assistance.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border border-white/20 shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-medical-dark mb-4">Upload Medical Images</h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-medical-primary bg-medical-primary/10' 
                : 'border-gray-300 hover:border-medical-primary hover:bg-gray-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-medical-primary font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  DICOM files (.dcm) or standard images (JPG, PNG, BMP)
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              Upload Error: {uploadError}
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/30"
                  >
                    <div className="flex items-center">
                      <FileImage className="h-5 w-5 text-medical-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedFileIds[index] && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartAnalysis}
                disabled={analyzing || uploading || uploadedFileIds.length === 0}
                className="w-full mt-4 bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {analyzing ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Analyzing...
                  </>
                ) : uploading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border border-white/20 shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-medical-dark mb-4">Analysis Results</h2>
          
          {!analysisResults && !analyzing && (
            <div className="text-center py-12">
              <FileImage className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Upload and analyze images to view results here</p>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-medical-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-medical-primary font-medium">AI analysis in progress...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          )}

          {analysisError && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
              <p className="text-red-600 font-medium">Analysis Error</p>
              <p className="text-sm text-gray-500 mt-2">{analysisError}</p>
            </div>
          )}

          {analysisResults && !analysisResults.error && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-medical-primary/10 to-medical-secondary/10 rounded-xl p-4 border border-medical-primary/20">
                <h3 className="font-semibold text-medical-dark mb-2">Overall Assessment</h3>
                <p className="text-gray-700">
                  Analysis completed with {analysisResults.findings?.length || 0} findings detected.
                  Overall confidence: {((analysisResults.confidence || 0) * 100).toFixed(1)}%
                </p>
              </div>

              {analysisResults.findings && analysisResults.findings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-medical-dark mb-3">Detected Findings</h3>
                  <div className="space-y-3">
                    {analysisResults.findings.map((finding: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white/50 rounded-xl p-4 border border-white/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{finding.type}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            finding.severity === 'low' ? 'bg-green-100 text-green-800' :
                            finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {finding.severity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Description:</strong> {finding.description}</p>
                          <p><strong>Confidence:</strong> {(finding.confidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button className="flex-1 bg-white/50 hover:bg-white/70 border border-white/30 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
                <button 
                  onClick={async () => {
                    if (analysisId) {
                      try {
                        const report = await ApiService.generateReport({ analysisId });
                        console.log('Report generated:', report);
                      } catch (error) {
                        console.error('Report generation failed:', error);
                      }
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-medical-secondary to-green-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {analysisResults?.error && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
              <p className="text-red-600 font-medium">Analysis Failed</p>
              <p className="text-sm text-gray-500 mt-2">{analysisResults.error}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Analysis Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border border-white/20 shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-medical-primary mr-2" />
          <h2 className="text-xl font-semibold text-medical-dark">Analysis Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
            <select 
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full p-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors"
            >
              <option value="general">General Medical Imaging v2.1</option>
              <option value="chest">Chest X-Ray Specialist v1.8</option>
              <option value="brain">Brain MRI Analyzer v3.0</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity</label>
            <select 
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              className="w-full p-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors"
            >
              <option value="high">High (More findings)</option>
              <option value="standard">Standard (Balanced)</option>
              <option value="conservative">Conservative (Fewer findings)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
            <select className="w-full p-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors">
              <option>Structured Report</option>
              <option>Detailed Analysis</option>
              <option>Summary Only</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadAnalysis;