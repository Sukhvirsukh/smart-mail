import { inject, injectable } from 'inversify';
import { NodemailerEmail } from '../utils/send-email/send-email.util';
import TYPES from '../constants/types.constants';
import SendEmails from '../database/models/send-emails.model';
import { SendEmailResponseModel } from '../models/send-email/response/send-email.response.model';
import { SendEmailRequestModel } from '../models/send-email/request/send-email.request.model';
import { EmailService } from './email.service';
import { ServerError, Status } from '../utils/error/server-error.util';

@injectable()
export class SendEmailService {
  constructor(
    @inject(TYPES.NodemailerEmail) private nodemailerEmail: NodemailerEmail,
    @inject(TYPES.EmailService) private emailService: EmailService
  ) {}

  /**
   * this function wil send the email
   * @param sendEmailOptions
   */
  public async sendEmail(sendEmailRequestModel: SendEmailRequestModel) {
    try {
      // Getting account information
      const accountData = await this.emailService.getAccountById(
        sendEmailRequestModel.account_id
      );

      if (accountData) {
        // Varify the time time gap check
        const isTimeGapExceeded = await this.varifyLastSentEmailGap(
          sendEmailRequestModel.account_id,
          accountData.minimum_time_gap
        );

        // Varify the number of messahe per day check
        const isMessagePerDayAvalibable =
          await this.checkMaxEmailSendLimtByAccountId(
            sendEmailRequestModel.account_id,
            accountData.messages_per_day
          );

        if (isTimeGapExceeded && isMessagePerDayAvalibable) {
          await this.nodemailerEmail.sendEmail(
            sendEmailRequestModel,
            accountData
          );
        }
        let id = await this.createSendEmailRecord(sendEmailRequestModel);
        return id;
      } else {
        throw 'Account not found';
      }
    } catch (exception) {
      let error = new ServerError(exception);
      error.status = Status.Error;
      throw error;
    }
  }

  public async createSendEmailRecord(
    sendEmailOptions: SendEmailRequestModel
  ): Promise<number> {
    try {
      const sendEmailData = await SendEmails.create({ ...sendEmailOptions });
      let response = JSON.parse(
        JSON.stringify(sendEmailData)
      ) as SendEmailResponseModel;
      return response?.id;
    } catch (exception) {
      throw exception;
    }
  }

  private async varifyLastSentEmailGap(
    accountId: number,
    minimumTimeGap: number
  ): Promise<boolean> {
    let lastEmailSend = await SendEmails.findOne({
      attributes: ['created_at'],
      where: {
        account_id: accountId,
      },
      order: [['created_at', 'DESC']],
    });
    if (lastEmailSend) {
      let lastSendEmailParsedData = JSON.parse(
        JSON.stringify(lastEmailSend)
      ) as SendEmailResponseModel;

      // getting current date time
      let currentDate = new Date();

      // Added given time gap in last send emails
      let createdAt = new Date(lastSendEmailParsedData.created_at);
      createdAt.setMinutes(createdAt.getMinutes() + minimumTimeGap);
      if (currentDate > createdAt) {
        return true;
      } else {
        throw `Email can be only be send after exceeding minimum time gap`;
      }
    }
    return true;
  }

  /**
   * This function will calculate if user have already exceeded
   * the maximum limit for the email send and throw error
   * @param accountId
   * @param messagesPerDay
   */
  private async checkMaxEmailSendLimtByAccountId(
    accountId: number,
    messagesPerDay: number
  ): Promise<boolean> {
    if (accountId) {
      let emailCount = await SendEmails.count({
        where: {
          account_id: accountId,
          created_at: new Date().getDate(),
        },
      });

      // if email count is less than given message per day then throw error
      if (emailCount >= messagesPerDay) {
        throw `Per day email send limit should be less than or equals to ${messagesPerDay}`;
      } else {
        return true;
      }
    }
  }
}
