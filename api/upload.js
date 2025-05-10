import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'Upload failed' });
    }

    const file = files.file[0];
    const fileName = Date.now() + '-' + file.originalFilename;
    const newPath = path.join(uploadDir, fileName);
    fs.renameSync(file.filepath, newPath);

    const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    const rawUrl = `${baseUrl}/api/upload?file=${fileName}`;

    res.json({ status: 'success', raw: rawUrl });
  });
}
