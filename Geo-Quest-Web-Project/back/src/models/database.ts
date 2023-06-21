import { Sequelize } from "sequelize";
import env from "mandatoryenv";

env.load([
    'DB',
]);
const { DB } = process.env;

const db = new Sequelize({
    dialect: 'sqlite',
    storage: DB,
});

export default db;