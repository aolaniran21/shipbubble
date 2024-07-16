import { Request, Response } from 'express';
import * as ticketService from '../services/ticketService';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const ticket = await ticketService.createTicket(userId);
        console.log(ticket)
        res.status(201).json(ticket);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const payForTicket = async (req: Request, res: Response) => {
    try {
        const { ticketId, userId } = req.body;
        const { ticket, user } = await ticketService.payForTicket(ticketId, userId);
        res.status(200).json({ ticket, user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
