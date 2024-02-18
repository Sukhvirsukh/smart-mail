"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**** databse connection using sequelize ORM ***  */
const sequelize_1 = require("sequelize");
require('dotenv').config();
const sequelizeDB = new sequelize_1.Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: 25060,
    define: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
exports.default = sequelizeDB;
