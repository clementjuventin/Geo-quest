import { DataTypes, Model } from "sequelize";
import db from "./database";

export class LocationModel extends Model {
    public id: number;
    public questId: number;
    public name: string;
    public description: string;
    public latitude: number; // X coordinate
    public longitude: number; // Y coordinate
    public code: string;
    public img: string | undefined;
}

LocationModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
        },
        description: {
            type: DataTypes.STRING(1024),
        },
        latitude: {
            type: DataTypes.FLOAT,
            validate: {
                isLatitude(value: number) {
                    if (value > 90 || value < -90) {
                        throw new Error("Latitude is invalid");
                    }
                }
            }
        },
        longitude: {
            type: DataTypes.FLOAT,
            validate: {
                isLongitude(value: number) {
                    if (value > 180 || value < -180) {
                        throw new Error("Longitude is invalid");
                    }
                }
            }
        },
        code: {
            type: DataTypes.STRING(33),
        },
        // Foreign key
        questId: {
            type: DataTypes.INTEGER,
        },
        img: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
    },
    {
        sequelize: db,
        modelName: 'location',
    }
);
