import { injectable } from 'inversify';
const nodemailer = require('nodemailer');
import { SendEmailRequestModel } from '../../models/send-email/request/send-email.request.model';
import AccountResponseModel from '../../models/account/response/account.response.model';
import { ProtocolEnum } from '../../constants/common.enums';

@injectable()
export class NodemailerEmail {
  /**
   * This function will send the email using SMTP
   * @param options
   */
  public async sendEmail(
    sendEmailRequestModel: SendEmailRequestModel,
    accountResponseModel: AccountResponseModel
  ): Promise<void> {
    try {
      let host = accountResponseModel.smtp_host;
      let port = accountResponseModel.smtp_port;
      let isSecure = false; // false for TLS, true for SSL
      if (accountResponseModel.communication_protocol == ProtocolEnum.SSL) {
        isSecure = true;
      }
      //SMTP settings
      const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: isSecure,
        auth: {
          user: accountResponseModel.from_email,
          pass: accountResponseModel.password,
        },
        from: accountResponseModel.from_email,
      });
      // Send email
      await transporter.sendMail(sendEmailRequestModel);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
