import * as Sequelize from 'sequelize';
import sequelizeDB from '../../utils/mysql/mysql.util';
import Accounts from './account.model';

const ReceiveEmails = sequelizeDB.define('receive_emails', {
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

ReceiveEmails.belongsTo(Accounts, { foreignKey: 'account_id' });

export default ReceiveEmails;
