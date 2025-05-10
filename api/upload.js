import express from 'express';
import multer from 'multer';
import path from 'path';

// Initialize express app
const app = express();

// Set storage engine for Multer (for storing files in the /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Set file name with timestamp
  }
});

// Initialize Multer with the storage settings and file size limit (10MB)
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 10 * 1024 * 1024 }  // Max file size 10MB
}).single('file');

// Middleware to handle file uploads and errors
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // Error handling (e.g. file size limit exceeded)
      console.error('Upload Error:', err);
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    // Successful upload
    return res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file
    });
  });
});

// Export the app for Vercel (or other serverless platforms)
export default app;
