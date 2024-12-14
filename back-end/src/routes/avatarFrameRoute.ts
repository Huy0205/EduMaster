import { Router } from 'express';
import { AvatarFrameController } from '../app/controllers';

const avatarFrameRouter = Router();

// GET: localhost:8080/api/v1/avatar-frame/list
avatarFrameRouter.get('/list', AvatarFrameController.getAllAvatarFrames);

// GET: localhost:8080/api/v1/avatar-frame/:avatarFrameId
avatarFrameRouter.get('/:avatarFrameId', AvatarFrameController.getAvatarFrameById);

export default avatarFrameRouter;
