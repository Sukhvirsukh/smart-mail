import { Request } from 'express';
import { isEmpty, isNaN } from 'lodash';
import { JoiValidationUtil } from '../../utils/validation/joi.util';
import { ServerError, Status } from '../../utils/error/server-error.util';

export class ReceviceEmailModel {
  public subject: string;
  public text: string;
  public account_id: number;
  public from_email: string;
  public date_time: string;
  public user_name: string;
  public html: string;
  public message_id: string;
}
