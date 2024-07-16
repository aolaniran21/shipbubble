import * as userService from '../../services/userService';
import User from '../../models/User';
import Transaction from '../../models/Transaction';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../models/User');
jest.mock('../../models/Transaction');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Service', () => {
    const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        balance: 100,
        save: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user', async () => {
            const hashedPassword = 'hashedpassword';

            const createMock = jest.fn().mockResolvedValue(mockUser);
            (User.create as jest.Mock) = createMock;
            const hashMock = jest.fn().mockResolvedValue(hashedPassword);
            (bcrypt.hash as jest.Mock) = hashMock;
            // (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            // (User.create as jest.Mock).mockResolvedValue(mockUser);

            const user = await userService.registerUser('testuser', 'testpass');

            expect(bcrypt.hash).toHaveBeenCalledWith('testpass', 10);
            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                password: hashedPassword
            });
            expect(user).toEqual(mockUser);
        });
    });

    describe('loginUser', () => {
        it('should login a user and return a token', async () => {

            const findOneMock = jest.fn().mockResolvedValue(mockUser);
            (User.findOne as unknown as jest.Mock) = findOneMock;

            const compareMock = jest.fn().mockResolvedValue(true);
            (bcrypt.compare as unknown as jest.Mock) = compareMock;

            const signMock = jest.fn().mockReturnValue('token');
            (jwt.sign as unknown as jest.Mock) = signMock;

            // (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            // (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            // (jwt.sign as jest.Mock).mockReturnValue('token');

            const { user, token } = await userService.loginUser('testuser', 'testpass');

            expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('testpass', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            expect(user).toEqual(mockUser);
            expect(token).toBe('token');
        });

        it('should throw an error if credentials are invalid', async () => {
            const findOneMock = jest.fn().mockResolvedValue(mockUser);
            (User.findOne as unknown as jest.Mock) = findOneMock;

            const compareMock = jest.fn().mockResolvedValue(false);
            (bcrypt.compare as unknown as jest.Mock) = compareMock;

            // (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            // (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.loginUser('testuser', 'testpass')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('creditAccount', () => {
        it('should credit the user\'s account', async () => {
            const findByPkMock = jest.fn().mockResolvedValue(mockUser);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            const createMock = jest.fn().mockResolvedValue({});
            (Transaction.create as unknown as jest.Mock) = createMock;

            const user = await userService.creditAccount(1, 50);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Transaction.create).toHaveBeenCalledWith({ userId: 1, type: 'credit', amount: 50 });
            expect(mockUser.save).toHaveBeenCalled();
            expect(user.balance).toBe(150);
        });

        it('should throw an error if user is not found', async () => {
            const findByPkMock = jest.fn().mockResolvedValue(null);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            await expect(userService.creditAccount(1, 50)).rejects.toThrow('User not found');
        });
    });

    describe('getUserBalance', () => {
        it('should return the user\'s balance', async () => {
            const findByPkMock = jest.fn().mockResolvedValue(mockUser);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            const balance = await userService.getUserBalance(1);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(balance).toBe(150);
        });

        it('should throw an error if user is not found', async () => {
            const findByPkMock = jest.fn().mockResolvedValue(null);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            await expect(userService.getUserBalance(1)).rejects.toThrow('User not found');
        });
    });

    // describe('getUserTransactions', () => {
    //     it('should return the user\'s transactions', async () => {
    //         const transactions = [{ id: 1, userId: 1, type: 'credit', amount: 50, date: new Date() }];
    //         const findAllMock = jest.fn().mockResolvedValue(transactions);
    //         (Transaction.findAll as unknown as jest.Mock) = findAllMock;

    //         const result = await userService.getUserTransactions(1, new Date(), new Date());


    //         expect(Transaction.findAll).toHaveBeenCalledWith({
    //             where: {
    //                 userId: 1,
    //                 date: {
    //                     [Symbol.for('between')]: [new Date(), new Date()],
    //                 },
    //             },
    //         });
    //         expect(result).toEqual(transactions);
    //     });
    // });


    describe('getUserTransactions', () => {
        it('should return the user\'s transactions', async () => {
            const mockDate = new Date('2024-07-16T16:17:34.000Z'); // Static date
            const transactions = [{ id: 1, userId: 1, type: 'credit', amount: 50, date: mockDate }];
            const findAllMock = jest.fn().mockResolvedValue(transactions);
            (Transaction.findAll as unknown as jest.Mock) = findAllMock;

            const result = await userService.getUserTransactions(1, mockDate, mockDate);

            expect(Transaction.findAll).toHaveBeenCalledWith({
                where: {
                    userId: 1,
                    date: {
                        [Symbol.for('between')]: [mockDate, mockDate],
                    },
                },
            });
            expect(result).toEqual(transactions);
        });
    });

    describe('transferCredit', () => {
        const toUser = { id: 2, balance: 50, save: jest.fn() };

        it('should transfer credit to another user', async () => {
            const findByPkMock = jest.fn().mockResolvedValueOnce(mockUser).mockResolvedValueOnce(toUser);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            const createMock = jest.fn().mockResolvedValue({});
            (Transaction.create as unknown as jest.Mock) = createMock;

            const result = await userService.transferCredit(1, 2, 50);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(User.findByPk).toHaveBeenCalledWith(2);
            expect(mockUser.save).toHaveBeenCalled();
            expect(toUser.save).toHaveBeenCalled();
            expect(result).toEqual({ fromUser: mockUser, toUser });
            expect(mockUser.balance).toBe(100);
            expect(toUser.balance).toBe(100);
        });

        it('should throw an error if balance is insufficient', async () => {
            const findByPkMock = jest.fn().mockResolvedValueOnce(mockUser).mockResolvedValueOnce(toUser);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            await expect(userService.transferCredit(1, 2, 200)).rejects.toThrow('Insufficient balance');
        });

        it('should throw an error if any user is not found', async () => {
            const findByPkMock = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            await expect(userService.transferCredit(1, 2, 50)).rejects.toThrow('User not found');
        });
    });
});
