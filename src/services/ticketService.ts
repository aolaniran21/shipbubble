import Ticket from '../models/Ticket';
import User from '../models/User';

export const createTicket = async (userId: number) => {
    const ticketId = `TICKET-${Date.now()}`;
    const ticket = await Ticket.create({ userId, ticketId });
    console.log(ticket)

    return ticket;
};

export const payForTicket = async (ticketId: string, userId: number) => {
    const ticket = await Ticket.findOne({ where: { ticketId, userId } });
    const user = await User.findByPk(userId);
    if (ticket && user) {
        const ticketPrice = 10; // Assuming ticket price is 10 units
        if (user.balance >= ticketPrice) {
            user.balance -= ticketPrice;
            ticket.paid = true;
            await user.save();
            await ticket.save();
            return { ticket, user };
        }
        throw new Error('Insufficient balance');
    }
    throw new Error('Ticket or User not found');
};
