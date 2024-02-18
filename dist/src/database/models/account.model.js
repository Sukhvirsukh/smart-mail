"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysql_util_1 = require("../../utils/mysql/mysql.util");
// Define model initialization function
const Accounts = mysql_util_1.default.define('accounts', {
    account_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    from_email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    smtp_host: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    smtp_port: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    communication_protocol: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    messages_per_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    minimum_time_gap: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    imap_host: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imap_port: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});
exports.default = Accounts;
