import { Router, Request, Response } from 'express';
import { register, login, creditAccount, viewBalance, viewTransactions, transferCredit } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('User route is working!');
});

router.post('/register', register);
router.post('/login', login);
router.post('/credit', authenticateToken, creditAccount);
router.get('/balance/:userId', authenticateToken, viewBalance);
router.get('/transactions', authenticateToken, viewTransactions);
router.post('/transfer', authenticateToken, transferCredit);

export default router;