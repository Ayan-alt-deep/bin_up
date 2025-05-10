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
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    keepExtensions: true,
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  // Ensure upload dir exists
  fs.mkdirSync(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'File upload failed' });
    }

    const file = files.file;
    const filePath = path.basename(file[0].filepath);
    const fileUrl = `${req.headers.host}/uploads/${filePath}`;

    return res.status(200).json({
      success: true,
      url: `https://${fileUrl}`,
      raw: `https://${fileUrl}` // <- this is what your bot reads as data.raw
    });
  });
}
