import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

export class CloudStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
    this.bucketName = process.env.GCS_BUCKET_NAME || 'medical-image-analysis-storage';
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
      const bucket = this.storage.bucket(this.bucketName);
      const fileObj = bucket.file(fileName);

      const stream = fileObj.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadDate: new Date().toISOString()
          }
        }
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('Upload error:', error);
          reject(error);
        });

        stream.on('finish', () => {
          resolve(`gs://${this.bucketName}/${fileName}`);
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Cloud Storage upload error:', error);
      throw new Error('File upload failed');
    }
  }

  async getSignedUrl(gcsPath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const fileName = gcsPath.replace(`gs://${this.bucketName}/`, '');
      const file = this.storage.bucket(this.bucketName).file(fileName);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresIn * 1000
      });

      return url;
    } catch (error) {
      console.error('Signed URL generation error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  async deleteFile(gcsPath: string): Promise<void> {
    try {
      const fileName = gcsPath.replace(`gs://${this.bucketName}/`, '');
      await this.storage.bucket(this.bucketName).file(fileName).delete();
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error('File deletion failed');
    }
  }
}