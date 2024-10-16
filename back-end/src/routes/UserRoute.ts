import { Router } from 'express';
import { UserController } from '~/app/controllers';

const userRouter = Router();

userRouter.get('/', (req, res) => {
  res.send('User Route');
});

// GET: localhost:8080/api/v1/user/:id
userRouter.get('/:id', UserController.getUserById);

// GET: localhost:8080/api/v1/user/role/:role
userRouter.get('/role/:role', UserController.getUsersByRole);

// POST: localhost:8080/api/v1/user/login
userRouter.post('/login', UserController.login);

// POST: localhost:8080/api/v1/user/register
userRouter.post('/register', UserController.register);

// PUT: localhost:8080/api/v1/user/update/:id
userRouter.put('/update/:id', UserController.updateUserById);

// DELETE: localhost:8080/api/v1/user/:id
userRouter.delete('/:id', UserController.deleteUserById);

export default userRouter;
