import { Router } from 'express';
import UserAuthController from '../controllers/userAuth.controller';
import basicAuth from '../middlewares/basicauth';

const router: Router = Router();

router.post('/signup', UserAuthController.signUpNewUser);
router.post('/login', basicAuth, UserAuthController.loginUser);

export default router;