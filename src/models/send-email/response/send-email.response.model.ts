import { Request } from 'express';
import { isEmpty, isNaN } from 'lodash';
import { JoiValidationUtil } from '../../../utils/validation/joi.util';
import { ServerError, Status } from '../../../utils/error/server-error.util';

export class SendEmailResponseModel {
  public id: number;
  public to: string;
  public subject: string;
  public text: string;
  public account_id: number;
  public created_at: string;
  public updated_at: string;

  public fromResponse(request: any) {
    try {
      this.to = request.body.to;
      this.subject = request.body.subject;
      this.text = request.body.text;
      this.account_id = request.body.account_id;
    } catch (exception) {
      let error = new ServerError(exception.message);
      error.status = Status.BadRequest;
    }
  }
}
