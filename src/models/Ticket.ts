import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Ticket extends Model {
    public id!: number;
    public userId!: number;
    public ticketId!: string;
    public paid!: boolean;

    public static associate(models: any) {
        Ticket.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    }
}

Ticket.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: User,
            key: 'id',
        },
    },
    ticketId: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    tableName: 'tickets',
});

export default Ticket;