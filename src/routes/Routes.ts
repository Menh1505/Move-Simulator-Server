import { Router } from 'express';
import { uploadSolidity, uploadMove } from '../controllers/uploadController';
import { upload } from '../config/multerConfig';

const router = Router();

router.post('/upload/solidity', upload.single('file'), uploadSolidity);
router.post('/upload/move/deploy', upload.single('file'), uploadMove);

export default router;