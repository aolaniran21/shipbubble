import { Router, Request, Response } from 'express';
import { createTicket, payForTicket } from '../controllers/ticketController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Ticket route is working!');
});

router.post('/create', authenticateToken, createTicket);
router.post('/pay', authenticateToken, payForTicket);

export default router;