"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysql_util_1 = require("../../utils/mysql/mysql.util");
const account_model_1 = require("./account.model");
const ReceiveEmails = mysql_util_1.default.define('receive_emails', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    account_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    from_email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    date_time: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    subject: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});
ReceiveEmails.belongsTo(account_model_1.default, { foreignKey: 'account_id' });
exports.default = ReceiveEmails;
