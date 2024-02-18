"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysql_util_1 = require("../../utils/mysql/mysql.util");
const account_model_1 = require("./account.model");
const SendEmails = mysql_util_1.default.define('send_emails', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    to: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subject: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
SendEmails.belongsTo(account_model_1.default, { foreignKey: 'account_id' });
exports.default = SendEmails;
