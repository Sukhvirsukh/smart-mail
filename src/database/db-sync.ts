import Accounts from './models/account.model';
import SendEmails from './models/send-emails.model';

export class DbSync {
  public async syncTables() {
    // await Accounts.sync({ force: true });
    await SendEmails.sync({ force: true });
  }
}
const dbSync = new DbSync();
dbSync.syncTables();
