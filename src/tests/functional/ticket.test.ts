import request from 'supertest';
import app from '../../app'; // Assuming your Express app is exported from app.ts
import * as ticketService from '../../services/ticketService';

jest.mock('../../services/ticketService');

describe('Ticket Controller', () => {
    let token: string;
    let user: any;
    let registeredUser: any;
    let create_ticket: any;

    beforeAll(async () => {
        // Register a new user before all tests
        const registerResponse = await request(app)
            .post('/users/register')
            .send({ username: `testuser${Date.now()}`, password: 'testpass' });
        registeredUser = registerResponse.body;

        const loginResponse = await request(app)
            .post('/users/login')
            .send({ username: registeredUser.username, password: 'testpass' });
        token = loginResponse.body.token;
        user = loginResponse.body.user;

        const credit = await request(app)
            .post('/users/credit')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: user.id, amount: 100 });
    });

    describe('createTicket', () => {
        it('should create a ticket and return 201 status', async () => {
            const mockTicket = {
                userId: user.id,
            };

            const createTicket = await request(app)
                .post('/tickets/create')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: user.id });

            expect(createTicket.status).toBe(201);
            create_ticket = createTicket.body;
        });

        it('should return 500 status on error', async () => {
            (ticketService.createTicket as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app)
                .post('/tickets/create')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: user.id });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    });

    describe('payForTicket', () => {
        it('should pay for a ticket and return 200 status', async () => {
            const mockTicket = {
                id: create_ticket.id,
                userId: user.id,
                paid: true,
            };
            const mockUser = {
                id: user.id,
                username: user.username,
            };

            (ticketService.payForTicket as jest.Mock).mockResolvedValue({
                ticket: mockTicket,
                user: mockUser,
            });

            const response = await request(app)
                .post('/tickets/pay')
                .set('Authorization', `Bearer ${token}`)
                .send({ ticketId: create_ticket.ticketId, userId: user.id });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ ticket: mockTicket, user: mockUser });
        });

        it('should return 500 status on error', async () => {
            (ticketService.payForTicket as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app)
                .post('/tickets/pay')
                .set('Authorization', `Bearer ${token}`)
                .send({ ticketId: create_ticket.ticketId, userId: user.id });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    });
});