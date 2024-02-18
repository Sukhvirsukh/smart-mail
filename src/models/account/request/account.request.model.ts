import { Request } from 'express';
import { isEmpty, isNaN } from 'lodash';
import { JoiValidationUtil } from '../../../utils/validation/joi.util';
import { ServerError, Status } from '../../../utils/error/server-error.util';

class AccountRequestModel {
  public account_id!: number;
  public first_name: string;
  public user_name: string;
  public from_email: string;
  public password: string;
  public smtp_host: string;
  public smtp_port: number;
  public communication_protocol: string;
  public messages_per_day: number;
  public minimum_time_gap: number;
  public imap_host: string;
  public imap_port: number;

  public fromRequest(request: Request) {
    try {
      AccountRequestModel.validateRequest(request);
      this.first_name = request.body.first_name;
      this.user_name = request.body.user_name;
      this.from_email = request.body.from_email;
      this.password = request.body.password;
      this.smtp_host = request.body.smtp_host;
      this.smtp_port = request.body.smtp_port;
      this.communication_protocol = request.body.communication_protocol;
      this.messages_per_day = request.body.messages_per_day;
      this.minimum_time_gap = request.body.minimum_time_gap;
      this.imap_host = request.body.imap_host;
      this.imap_port = request.body.imap_port;
    } catch (exception) {
      let error = new ServerError(exception);
      error.status = Status.BadRequest;
      throw error;
    }
  }

  public static validateRequest(request: Request) {
    try {
      if (isEmpty(request.body)) {
        throw 'Invalid request. Missing request object.';
      }

      if (
        !request.body.first_name &&
        !request.body.user_name &&
        !request.body.from_email &&
        !request.body.password &&
        !request.body.smtp_host &&
        !request.body.smtp_port &&
        !request.body.communication_protocol &&
        !request.body.minimum_time_gap &&
        !request.body.messages_per_day &&
        !request.body.imap_host
      ) {
        throw 'All fields are required';
      }

      if (
        isNaN(request.body.smtp_port) &&
        isNaN(request.body.minimum_time_gap) &&
        isNaN(request.body.messages_per_day)
      ) {
        throw 'smtp_port, minimum_time_gap, messages_per_day should have nummaric value';
      }

      // if (!request.body.account_id && !isNaN(request.body.account_id)) {
      //   throw 'Invalid account id';
      // }

      if (!JoiValidationUtil.validateEmail(request.body.from_email)) {
        throw 'Invalid email';
      }
    } catch (exception) {
      throw exception;
    }
  }
}

export default AccountRequestModel;
