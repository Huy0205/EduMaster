import { Router } from 'express';
import { AvatarFrameController } from '~/app/controllers';
// import { authentication } from '~/middlewares';

const avatarFrameRouter = Router();

// GET: localhost:8080/api/v1/avatar-frame/list
// avatarFrameRouter.get('/list', authentication, AvatarFrameController.getAllAvatarFrames);
avatarFrameRouter.get('/list', AvatarFrameController.getAllAvatarFrames);

// GET: localhost:8080/api/v1/avatar-frame/:avatarFrameId
// avatarFrameRouter.get('/:avatarFrameId', authentication, AvatarFrameController.getAvatarFrameById);
avatarFrameRouter.get('/:avatarFrameId', AvatarFrameController.getAvatarFrameById);

export default avatarFrameRouter;
