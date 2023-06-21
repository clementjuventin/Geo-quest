import { DataTypes, Model } from "sequelize";
import db from "./database";
import { UserClaimModel } from "./userClaim";

export class UserModel extends Model {
    public id: number;
    public username: string;
    public passhash: string;
    public creationDate: Date;
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(128),
            validate: {
                is: /^[a-z\-'\s]{1,128}$/i
            }
        },
        passhash: {
            type: DataTypes.STRING(60),
            validate: {
                is: /^[0-9a-z\\/$.]{60}$/i
            }
        },
        creationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: db,
        modelName: 'user',
    }
);

UserModel.hasMany(UserClaimModel);
UserClaimModel.belongsTo(UserModel);