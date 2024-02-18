import * as Sequelize from 'sequelize';
import sequelizeDB from '../../utils/mysql/mysql.util';
import Accounts from './account.model';

const SendEmails = sequelizeDB.define('send_emails', {
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

SendEmails.belongsTo(Accounts, { foreignKey: 'account_id' });

export default SendEmails;
