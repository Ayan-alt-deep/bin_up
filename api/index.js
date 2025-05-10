const express = require('express');
const multer = require('multer');
const app = express();

// Use memory storage (Vercel doesn't allow writing to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file received.' });
  }

  // You can process or forward req.file.buffer here
  res.json({ message: 'File uploaded successfully (in memory).' });
});

module.exports = app;
