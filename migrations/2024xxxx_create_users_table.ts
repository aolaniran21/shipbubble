import { QueryInterface, DataTypes } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('users', {
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
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('users');
    },
};
