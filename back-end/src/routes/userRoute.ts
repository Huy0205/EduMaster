import { Router } from 'express';
import { UserController } from '../app/controllers';

const userRouter = Router();

// GET: localhost:8080/api/v1/user/auth
userRouter.get('/auth', UserController.authUser);

// GET: localhost:8080/api/v1/user/:id
userRouter.get('/:id', UserController.getUserById);

// GET: localhost:8080/api/v1/user/role/:role
userRouter.get('/role/:role', UserController.getUsersByRole);

// GET: localhost:8080/api/v1/user/grade/:grade
userRouter.get('/grade/:grade', UserController.getUsersByGrade);

// GET: localhost:8080/api/v1/user/student/count
userRouter.get('/student/count', UserController.countStudent);

// GET: localhost:8080/api/v1/user/student/new-per-month
userRouter.get('/student/new-per-month', UserController.getNewUsersPerMonth);

// POST: localhost:8080/api/v1/user/send-otp-by-mail
userRouter.post('/send-otp-by-mail', UserController.sendOTPByMail);

// POST: localhost:8080/api/v1/user/verify-otp
userRouter.post('/verify-otp', UserController.verifyOTP);

// POST: localhost:8080/api/v1/user/login
userRouter.post('/login', UserController.login);

// POST: localhost:8080/api/v1/user/register
userRouter.post('/register', UserController.register);

// POST: localhost:8080/api/v1/user/check-password
userRouter.post('/check-password', UserController.checkPasswordByEmail);

// PUT: localhost:8080/api/v1/user/update/:id
userRouter.put('/update/:id', UserController.updateUser);

// DELETE: localhost:8080/api/v1/user/:id
userRouter.delete('/:id', UserController.deleteUserById);

export default userRouter;
