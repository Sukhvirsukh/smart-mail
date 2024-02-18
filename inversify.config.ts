import { Container } from 'inversify';
import TYPES from './src/constants/types.constants';
import { NodemailerEmail } from './src/utils/send-email/send-email.util';
import { EmailService } from './src/services/email.service';
import { SendEmailService } from './src/services/send-email.service';
import { ReceviceEmailService } from './src/services/recevice-email.service';

const iocContainer = new Container();
iocContainer
  .bind<NodemailerEmail>(TYPES.NodemailerEmail)
  .to(NodemailerEmail)
  .inSingletonScope();

iocContainer
  .bind<EmailService>(TYPES.EmailService)
  .to(EmailService)
  .inSingletonScope();
iocContainer
  .bind<SendEmailService>(TYPES.SendEmailService)
  .to(SendEmailService)
  .inSingletonScope();
iocContainer
  .bind<ReceviceEmailService>(TYPES.ReceviceEmailService)
  .to(ReceviceEmailService)
  .inSingletonScope();

export { iocContainer };
