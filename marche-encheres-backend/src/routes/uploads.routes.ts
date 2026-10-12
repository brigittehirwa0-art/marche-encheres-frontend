import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { handleUploadError, upload } from '../middlewares/upload.middleware';

const router = Router();

router.post('/', authMiddleware, upload.array('images', 10), handleUploadError, (req: Request, res: Response) => {
  const files = (req as Request & { files?: { filename: string }[] }).files ?? [];
  if (files.length === 0) {
    return res.status(400).json({ success: false, message: 'Choisissez au moins une photo.' });
  }

  const urls = files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
  return res.status(201).json({ success: true, data: { urls } });
});

export default router;
