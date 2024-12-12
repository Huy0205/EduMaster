import { Router } from 'express';
import { UploadController } from '~/app/controllers';
import upload from '~/middlewares/upload';

const uploadRouter = Router();

// POST: localhost:8080/api/v1/upload
uploadRouter.post('/', upload.single('file'), UploadController.uploadFile);

export default uploadRouter;
