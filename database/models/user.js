import sequelize from './index.js';
import { DataTypes, Model } from 'sequelize';

export class User extends Model {
    //buffer에 저장하면 binary 형태로 저장이 되기 때문에 json type으로 다시 변환시켜주기 위함
    toJSON() {
        return super.toJSON();
    }
}

User.init(
    {
        id: {
            type: DataTypes.STRING(60),
            primaryKey: true,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },

        birth: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        gender: {
            type: DataTypes.CHAR(1),
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        last_login: {
            type: 'Timestamp',
            allowNull: false,
        },

        token: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },

    {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps: false,
    }
);
