import { Router } from 'express';
import { UserController } from '~/app/controllers';

const userRouter = Router();

userRouter.get('/', (req, res) => {
  res.send('User Route');
});

userRouter.post('/login', UserController.login);

userRouter.post('/register', UserController.register);

userRouter.get('/role/:role', UserController.getUsersByRole);

export default userRouter;
