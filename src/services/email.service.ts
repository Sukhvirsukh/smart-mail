import { injectable } from 'inversify';
import Accounts from '../database/models/account.model';
import AccountRequestModel from '../models/account/request/account.request.model';
import AccountResponseModel from '../models/account/response/account.response.model';
import { ServerError, Status } from '../utils/error/server-error.util';

@injectable()
export class EmailService {
  constructor() {}

  public async createAccount(
    sendEmailOptions: AccountRequestModel
  ): Promise<number> {
    try {
      let isAccountExist = await this.getAccountByEmail(
        sendEmailOptions.from_email
      );
      if (isAccountExist) {
        throw `Account already exists with email address ${sendEmailOptions.from_email}`;
      }
      const account = await Accounts.create({ ...sendEmailOptions });
      let type = JSON.parse(JSON.stringify(account)) as AccountRequestModel;
      return type?.account_id;
    } catch (exception) {
      let error = new ServerError(exception);
      error.status = Status.Error;
      throw error;
    }
  }

  public async getAccountById(
    accountId: number
  ): Promise<AccountResponseModel> {
    try {
      let account = await Accounts.findByPk(accountId);
      if (account) {
        return JSON.parse(
          JSON.stringify(account)
        ) as unknown as AccountResponseModel;
      }
    } catch (error) {
      throw error;
    }
  }

  public async getAccountByEmail(email: string): Promise<AccountResponseModel> {
    try {
      let account = await Accounts.findOne({ where: { from_email: email } });
      if (account) {
        return JSON.parse(JSON.stringify(account));
      }
    } catch (error) {
      throw error;
    }
  }
}
