import multer from 'multer';
import * as fs from 'fs';

// Set up multer for file storage
const upload = multer({ dest: './uploads/' });

export const config = {
  api: {
    bodyParser: false, // Disabling Vercel's body parser to handle file uploads manually
  },
};

const handler = (req, res) => {
  if (req.method === 'POST') {
    const uploadMiddleware = upload.single('file');
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload file' });
      }
      return res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
