import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Transaction extends Model {
    public id!: number;
    public userId!: number;
    public type!: string;
    public amount!: number;
    public date!: Date;

    public static associate(models: any) {
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    }
}

Transaction.init({
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
    type: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'transactions',
});

// Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Transaction;
