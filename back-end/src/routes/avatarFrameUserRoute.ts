import { Router } from 'express';
import { AvatarFrameUserController } from '~/app/controllers';
// import { authentication } from '~/middlewares';

const avatarFrameUserRouter = Router();

// GET: localhost:8080/api/v1/avatar-frame-user/user/:userId
// avatarFrameUserRouter.get('/user/:userId', authentication, AvatarFrameUserController.getAvatarFrameUsersByUser);
avatarFrameUserRouter.get('/user/:userId', AvatarFrameUserController.getAvatarFrameUsersByUser);

// POST: localhost:8080/api/v1/avatar-frame-user/add
// avatarFrameUserRouter.post('/add', authentication, AvatarFrameUserController.addAvatarFrameUser);
avatarFrameUserRouter.post('/add', AvatarFrameUserController.addAvatarFrameUser);

// PUT: localhost:8080/api/v1/avatar-frame-user/update-is-active-true
// avatarFrameUserRouter.put('/update-is-active-true', authentication, AvatarFrameUserController.updateIsActiveTrueByAvatarFrame);
avatarFrameUserRouter.put(
    '/update-is-active-true',
    AvatarFrameUserController.updateIsActiveTrueByAvatarFrame,
);

export default avatarFrameUserRouter;
