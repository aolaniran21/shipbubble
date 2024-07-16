import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { Op } from 'sequelize';

export const registerUser = async (username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    return user;
};

export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { user, token };
    }
    throw new Error('Invalid credentials');
};

export const creditAccount = async (userId: number, amount: number) => {
    const user = await User.findByPk(userId);
    if (user) {
        user.balance += amount;
        await user.save();
        await Transaction.create({ userId: user.id, type: 'credit', amount });
        return user;
    }
    throw new Error('User not found');
};

export const getUserBalance = async (userId: number) => {
    const user = await User.findByPk(userId);
    if (user) {
        return user.balance;
    }
    throw new Error('User not found');
};

export const getUserTransactions = async (userId: number, startDate: Date, endDate: Date) => {
    const transactions = await Transaction.findAll({
        where: {
            userId,
            date: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    return transactions;
};

export const transferCredit = async (fromUserId: number, toUserId: number, amount: number) => {
    const fromUser = await User.findByPk(fromUserId);
    const toUser = await User.findByPk(toUserId);
    if (fromUser && toUser) {
        if (fromUser.balance >= amount) {
            fromUser.balance -= amount;
            toUser.balance += amount;
            await fromUser.save();
            await toUser.save();
            await Transaction.create({ userId: fromUser.id, type: 'debit', amount });
            await Transaction.create({ userId: toUser.id, type: 'credit', amount });
            return { fromUser, toUser };
        }
        throw new Error('Insufficient balance');
    }
    throw new Error('User not found');
};
