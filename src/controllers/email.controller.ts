import { Request, Response } from 'express';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { EmailService } from '../services/email.service';
import TYPES from '../constants/types.constants';
import AccountRequestModel from '../models/account/request/account.request.model';
import { Status } from '../utils/error/server-error.util';
import { SendEmailRequestModel } from '../models/send-email/request/send-email.request.model';
import { SendEmailService } from '../services/send-email.service';
import { ReceviceEmailService } from '../services/recevice-email.service';

@controller('/email')
export class EmailController {
  constructor(
    @inject(TYPES.EmailService) private emailService: EmailService,
    @inject(TYPES.SendEmailService) private sendEmailService: SendEmailService,
    @inject(TYPES.ReceviceEmailService)
    private receviceEmailService: ReceviceEmailService
  ) {}

  @httpPost('/create-account')
  async createAccount(request: Request, response: Response) {
    try {
      // Validating and preparing the model
      const accountRequest = new AccountRequestModel();
      accountRequest.fromRequest(request);

      // Creating the account
      const accountId = await this.emailService.createAccount(accountRequest);

      // Preparing the reponse
      response.status(201).json({
        status: Status.Created,
        accountId: accountId,
      });
    } catch (error) {
      const status = error.status ? error.status : Status.Error;
      const message = error.message ? error.message : 'Something went wrong';
      response.status(status).json({
        message: message,
        status: status,
      });
    }
  }

  @httpPost('/send-email')
  async sendEmail(request: Request, response: Response) {
    try {
      const sendEmailRequestModel = new SendEmailRequestModel();
      sendEmailRequestModel.fromRequest(request);

      const emailSendId = await this.sendEmailService.sendEmail(
        sendEmailRequestModel
      );

      response.status(201).json({
        status: Status.Created,
        Id: emailSendId,
      });
    } catch (error) {
      const status = error.status ? error.status : Status.Error;
      const message = error.message ? error.message : 'Something went wrong';
      response.status(status).json({
        message: message,
        status: status,
      });
    }
  }

  @httpGet('/sync-emails')
  async syncEmail(request: Request, response: Response) {
    try {
      if (request.query?.id) {
        let accountId = parseInt(request.query?.id.toString());
        const emailSendId = await this.receviceEmailService.receviceEmail(
          accountId
        );

        response.status(201).json({
          status: Status.Created,
          Id: emailSendId,
        });
      } else {
        throw 'accountId query parameter is required';
      }
    } catch (error) {
      const status = error.status ? error.status : Status.Error;
      const message = error.message ? error.message : 'Something went wrong';
      response.status(status).json({
        message: message,
        status: status,
      });
    }
  }

  @httpGet('/get-receive-email')
  async getReceiveEmail(request: Request, response: Response) {
    try {
      if (request.query?.id) {
        let accountId = parseInt(request.query?.id.toString());
        const receiveEmail = await this.receviceEmailService.getReceiveEmail(
          accountId
        );

        response.status(200).json({
          receiveEmail: receiveEmail,
        });
      } else {
        throw 'accountId query parameter is required';
      }
    } catch (error) {
      const status = error.status ? error.status : Status.Error;
      const message = error.message ? error.message : 'Something went wrong';
      response.status(status).json({
        message: message,
        status: status,
      });
    }
  }

  @httpPost('/track:id')
  async emailTracking(req: Request, response: Response) {
    try {
      // TODO: need to add tracking code here
    } catch (error) {
      const status = error.status ? error.status : Status.Error;
      const message = error.message ? error.message : 'Something went wrong';
      response.status(status).json({
        message: message,
        status: status,
      });
    }
  }
}
