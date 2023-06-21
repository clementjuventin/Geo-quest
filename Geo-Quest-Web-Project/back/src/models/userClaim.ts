import { DataTypes, Model } from "sequelize";
import db from "./database";
import { UserModel } from "./user";

export class UserClaimModel extends Model {
    public id: number;
    // Foreign key
    public userId: number;
    public locationId: number;

    public date: Date;
}

UserClaimModel.init(
    {
        // Primary key
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Foreign key
        userId: {
            type: DataTypes.INTEGER,
            validate: {
                is: /^[0-9]{1,128}$/i
            }
        },
        // Foreign key
        locationId: {
            type: DataTypes.INTEGER,
            validate: {
                is: /^[0-9]{1,128}$/i
            }
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize: db,
        modelName: 'userClaim',
    }
);