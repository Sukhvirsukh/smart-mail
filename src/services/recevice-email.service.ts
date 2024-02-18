import { inject, injectable } from 'inversify';
import TYPES from '../constants/types.constants';
import { EmailService } from './email.service';
import ReceiveEmails from '../database/models/receive-email.model';
import { ReceviceEmailModel } from '../models/recevice-email/recevice-email.model';
import AccountResponseModel from '../models/account/response/account.response.model';
import { ServerError, Status } from '../utils/error/server-error.util';
const Imap = require('imap');
const { simpleParser } = require('mailparser');

@injectable()
export class ReceviceEmailService {
  constructor(@inject(TYPES.EmailService) private emailService: EmailService) {}

  public async receviceEmail(accountId: number) {
    try {
      // Getting account information
      const accountData = await this.emailService.getAccountById(accountId);
      if (accountData) {
        let data = await this.receviceImapEmail(accountData);
      } else {
        throw 'Account not found';
      }
    } catch (exception) {
      let error = new ServerError(exception);
      error.status = Status.Error;
      throw error;
    }
  }

  public async createBulkEmail(bulkData: any) {
    try {
      // Insert the bulk data into the receive_email table
      await ReceiveEmails.bulkCreate(bulkData);
      console.log('Bulk data insertion completed successfully');
    } catch (error) {
      console.error('Error inserting bulk data:', error);
    }
  }

  public async receviceImapEmail(accountResponseModel: AccountResponseModel) {
    try {
      let acconutId = accountResponseModel.account_id;
      let emails: ReceviceEmailModel[] = [];
      let user = accountResponseModel.from_email;
      let host = accountResponseModel.imap_host;
      // IMAP server configuration
      let imapConfig = {
        user: user,
        password: accountResponseModel.password,
        host: host,
        port: 993,
        tls: true,
      };

      const imap = new Imap(imapConfig);
      let conut = 0;
      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            throw `Error opening mailbox:', ${err}`;
          }

          const searchCriteria = ['UNSEEN']; // Fetch unseen emails
          const fetchOptions = { bodies: '', markSeen: true }; // Fetch email bodies and mark emails as seen

          imap.search(searchCriteria, (searchErr, results) => {
            if (searchErr) {
              console.error('Error searching for emails:', searchErr);
            }
            conut = results.length;

            const fetch = imap.fetch(results, fetchOptions);

            fetch.on('message', (msg) => {
              const emailData = { headers: {} };

              msg.on('body', (stream) => {
                let body = '';
                stream.on('data', (chunk) => {
                  body += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  emailData['body'] = body;
                });
              });

              msg.once('attributes', (attrs) => {
                emailData.headers = attrs.struct;
              });

              msg.once('end', () => {
                // Extract desired fields and store in an object
                if (emailData['body']) {
                  simpleParser(emailData['body'], async (err, parsed) => {
                    if (err) {
                      console.error('Error parsing email body:', err);
                      return;
                    }
                    let email = new ReceviceEmailModel();
                    email.date_time = parsed?.date;
                    email.subject = parsed?.subject;
                    email.html = parsed?.html;
                    email.text = parsed?.text;
                    email.account_id = acconutId;

                    if (parsed?.from?.text) {
                      email.from_email = parsed?.from?.value[0].address;
                      email.user_name = parsed?.from?.value[0].name;
                    }
                    emails.push(email);
                    if (conut == emails.length) {
                      await this.createBulkEmail(emails);
                    }
                  });
                }
              });
            });

            fetch.once('error', (fetchErr) => {
              console.error('Error fetching emails:', fetchErr);
            });

            fetch.once('end', () => {
              imap.end();
            });
          });
        });
      });

      imap.once('error', (err) => {
        console.error('IMAP error:', err);
      });

      imap.once('end', (err) => {
        console.error('IMAP error:', err);
      });

      imap.connect();
    } catch (exception) {
      let error = new ServerError(exception);
      error.status = Status.Error;
      throw error;
    }
  }

  public async getReceiveEmail(accountId: number): Promise<ReceviceEmailModel> {
    try {
      const receiveEmail = await ReceiveEmails.findAll({
        where: { account_id: accountId },
      });

      if (receiveEmail.length > 0) {
        await this.deleteReceiveEmail(accountId);
        let emails = JSON.parse(
          JSON.stringify(receiveEmail)
        ) as ReceviceEmailModel;
        return emails;
      } else {
        throw 'No new email received';
      }
    } catch (exception) {
      let error = new ServerError(exception);
      error.status = Status.Error;
      throw error;
    }
  }

  public async deleteReceiveEmail(accountId: number) {
    try {
      let test = await ReceiveEmails.destroy({
        where: { account_id: accountId },
      });
    } catch (error) {
      throw error;
    }
  }
}
