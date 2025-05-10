import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Filename format
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });  // Limit file size to 10MB

// Handle file upload at /upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Successfully uploaded, return file info
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

// Export app to be used in Vercel
export default app;
