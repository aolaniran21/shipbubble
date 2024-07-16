import { Model, DataTypes, Op } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public balance!: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'users',
});

export default User;
