import * as ticketService from '../../services/ticketService';
import Ticket from '../../models/Ticket';
import User from '../../models/User';

jest.mock('../../models/Ticket');
jest.mock('../../models/User');

describe('Ticket Service', () => {
    const mockUser = {
        id: 1,
        username: 'testuser',
        balance: 100,
        save: jest.fn()
    };

    const mockTicket = {
        id: 1,
        userId: 1,
        ticketId: 'TICKET-12345',
        paid: false,
        save: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTicket', () => {
        it('should create a new ticket', async () => {
            const createMock = jest.fn().mockResolvedValue(mockTicket);
            (Ticket.create as jest.Mock) = createMock;
            // (Ticket.create as jest.Mock).mockResolvedValue(mockTicket);

            const ticket = await ticketService.createTicket(1);

            expect(Ticket.create).toHaveBeenCalledWith({ userId: 1, ticketId: expect.any(String) });
            expect(ticket).toEqual(mockTicket);
        });
    });

    describe('payForTicket', () => {
        it('should pay for a ticket', async () => {

            // Mock the Ticket.findOne method to return the mockTicket
            const findOneMock = jest.fn().mockResolvedValue(mockTicket);
            (Ticket.findOne as unknown as jest.Mock) = findOneMock;

            // Mock the User.findByPk method to return the mockUser
            const findByPkMock = jest.fn().mockResolvedValue(mockUser);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;

            // (Ticket.findOne as jest.Mock).mockResolvedValue(mockTicket);
            // (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            const { ticket, user } = await ticketService.payForTicket('TICKET-12345', 1);

            expect(Ticket.findOne).toHaveBeenCalledWith({ where: { ticketId: 'TICKET-12345', userId: 1 } });
            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockTicket.save).toHaveBeenCalled();
            expect(ticket.paid).toBe(true);
            expect(user.balance).toBe(90); // Assuming ticket price is 10 units
        });

        it('should throw an error if balance is insufficient', async () => {
            mockUser.balance = 5;

            // Mock the Ticket.findOne method to return the mockTicket
            const findOneMock = jest.fn().mockResolvedValue(mockTicket);
            (Ticket.findOne as unknown as jest.Mock) = findOneMock;

            // Mock the User.findByPk method to return the mockUser
            const findByPkMock = jest.fn().mockResolvedValue(mockUser);
            (User.findByPk as unknown as jest.Mock) = findByPkMock;
            // (Ticket.findOne as jest.Mock).mockResolvedValue(mockTicket);
            // (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await expect(ticketService.payForTicket('TICKET-12345', 1)).rejects.toThrow('Insufficient balance');
        });

        it('should throw an error if ticket or user is not found', async () => {

            const findOneMock = jest.fn().mockResolvedValue(null);
            (Ticket.findOne as unknown as jest.Mock) = findOneMock;

            // (Ticket.findOne as jest.Mock).mockResolvedValue(null);

            await expect(ticketService.payForTicket('TICKET-12345', 1)).rejects.toThrow('Ticket or User not found');
        });
    });
});
