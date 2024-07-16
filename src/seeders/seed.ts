import sequelize from '../config/database';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Ticket from '../models/Ticket';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all models
        await sequelize.sync({ force: true }); // This will drop the existing tables and create new ones

        // Hash password
        const hashedPassword = await bcrypt.hash('password', 10);

        // Create Users
        const users = await User.bulkCreate([
            { username: 'user1', password: hashedPassword, balance: 100 },
            { username: 'user2', password: hashedPassword, balance: 150 },
        ]);

        // Create Transactions
        await Transaction.bulkCreate([
            { userId: users[0].id, type: 'credit', amount: 100 },
            { userId: users[1].id, type: 'credit', amount: 150 },
            { userId: users[0].id, type: 'debit', amount: 50 },
            { userId: users[1].id, type: 'debit', amount: 20 },
        ]);

        // Create Tickets
        await Ticket.bulkCreate([
            { userId: users[0].id, ticketId: 'ticket1' },
            { userId: users[1].id, ticketId: 'ticket2' },
            { userId: users[0].id, ticketId: 'ticket3' },
            { userId: users[1].id, ticketId: 'ticket4' },
        ]);

        console.log('Seed data created successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

seed();
