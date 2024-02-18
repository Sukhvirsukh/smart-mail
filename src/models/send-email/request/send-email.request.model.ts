import { Request } from 'express';
import { isEmpty, isNaN } from 'lodash';
import { JoiValidationUtil } from '../../../utils/validation/joi.util';
import { ServerError, Status } from '../../../utils/error/server-error.util';

export class SendEmailRequestModel {
  public to: string;
  public subject: string;
  public text: string;
  public account_id: number;

  public fromRequest(request: Request) {
    try {
      SendEmailRequestModel.validateRequest(request);
      this.to = request.body.to;
      this.subject = request.body.subject;
      this.text = request.body.text;
      this.account_id = request.body.account_id;
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

      if (request.body.account_id && isNaN(request.body.account_id)) {
        throw 'Invalid account id';
      }

      if (!JoiValidationUtil.validateEmail(request.body.to)) {
        throw 'Invalid email';
      }
    } catch (exception) {
      throw exception;
    }
  }
}
