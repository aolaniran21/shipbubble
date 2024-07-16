import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await userService.registerUser(username, password);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await userService.loginUser(username, password);
        res.status(200).json({ user: { username: user.username, id: user.id, balance: user.balance }, token });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export const creditAccount = async (req: Request, res: Response) => {
    try {
        const { userId, amount } = req.body;
        const user = await userService.creditAccount(userId, amount);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const viewBalance = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const balance = await userService.getUserBalance(userId);
        res.status(200).json({ balance });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const viewTransactions = async (req: Request, res: Response) => {
    try {
        const { userId, startDate, endDate } = req.query;
        const transactions = await userService.getUserTransactions(
            parseInt(userId as string),
            new Date(startDate as string),
            new Date(endDate as string)
        );
        res.status(200).json(transactions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const transferCredit = async (req: Request, res: Response) => {
    try {
        const { fromUserId, toUserId, amount } = req.body;
        const { fromUser, toUser } = await userService.transferCredit(
            parseInt(fromUserId),
            parseInt(toUserId),
            amount
        );
        res.status(200).json({ fromUser, toUser });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
