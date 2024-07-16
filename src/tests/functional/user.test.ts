import request from 'supertest';
import app from '../../app'; // Assuming your Express app is exported from app.ts

describe('User Controller', () => {
    let token: string;
    let user: any;
    let registeredUser: any;

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
    });

    describe('POST /users/register', () => {
        it('should register a new user', async () => {
            // Since we register a new user in beforeAll, we can directly assert the registeredUser
            expect(registeredUser).toHaveProperty('username');
        });
    });

    describe('POST /users/login', () => {
        it('should login a user', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({ username: registeredUser.username, password: 'testpass' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('username');
            expect(response.body.user).toHaveProperty('balance');
        });
    });

    describe('POST /users/credit', () => {
        it('should credit a user account', async () => {
            const response = await request(app)
                .post('/users/credit')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: user.id, amount: 100 });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('balance');
        });
    });

    describe('GET /users/balance/:userId', () => {
        it('should return user balance', async () => {
            const response = await request(app)
                .get(`/users/balance/${user.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('balance');
        });
    });

    describe('GET /users/transactions', () => {
        it('should return user transactions', async () => {
            const response = await request(app)
                .get('/users/transactions')
                .set('Authorization', `Bearer ${token}`)
                .query({ userId: user.id, startDate: '2023-01-01', endDate: '2023-12-31' });
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /users/transfer', () => {
        it('should transfer credit between users', async () => {
            const response = await request(app)
                .post('/users/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send({ fromUserId: user.id, toUserId: 2, amount: 50 });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('fromUser');
            expect(response.body).toHaveProperty('toUser');
        });
    });
});