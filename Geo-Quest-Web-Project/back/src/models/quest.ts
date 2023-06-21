import { DataTypes, Model } from "sequelize";
import db from "./database";

export class QuestModel extends Model {
    public id: number;
    // Foreign key
    public creatorId: number;
    public name: string;
    public description: string;
    public creationDate: Date;
    public active: boolean;
    public endDate: Date | undefined;
    public img: string | undefined;
    code: string;
}

QuestModel.init(
    {
        // Primary key
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Foreign key
        creatorId: {
            type: DataTypes.INTEGER,
            validate: {
                is: /^[0-9]{1,128}$/i
            }
        },
        name: {
            type: DataTypes.STRING(128),
        },
        description: {
            type: DataTypes.STRING(1024),
        },
        creationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        code: {
            type: DataTypes.STRING(32),
        },
        // Optional
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        img: {
            type: DataTypes.STRING(256),
            allowNull: true
        }
    },
    {
        sequelize: db,
        modelName: 'quest',
    }
);
