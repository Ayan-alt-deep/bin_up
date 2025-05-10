const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();

const UPLOADS_FOLDER = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const ext = path.extname(file.originalname);
    cb(null, randomId + ext);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    id: path.basename(req.file.filename),
    url: req.protocol + '://' + req.get('host') + '/raw/' + path.basename(req.file.filename)
  });
});

app.get('/raw/:id', (req, res) => {
  const file = path.join(UPLOADS_FOLDER, req.params.id);
  if (!fs.existsSync(file)) return res.status(404).send('File not found');
  res.sendFile(file);
});

app.delete('/delete/:id', (req, res) => {
  const file = path.join(UPLOADS_FOLDER, req.params.id);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'File not found' });
  fs.unlinkSync(file);
  res.json({ success: true });
});

module.exports = app;