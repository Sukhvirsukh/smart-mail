"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iocContainer = void 0;
const inversify_1 = require("inversify");
const types_constants_1 = require("./src/constants/types.constants");
const send_email_util_1 = require("./src/utils/send-email/send-email.util");
const email_service_1 = require("./src/services/email.service");
const send_email_service_1 = require("./src/services/send-email.service");
const recevice_email_service_1 = require("./src/services/recevice-email.service");
const iocContainer = new inversify_1.Container();
exports.iocContainer = iocContainer;
iocContainer
    .bind(types_constants_1.default.NodemailerEmail)
    .to(send_email_util_1.NodemailerEmail)
    .inSingletonScope();
iocContainer
    .bind(types_constants_1.default.EmailService)
    .to(email_service_1.EmailService)
    .inSingletonScope();
iocContainer
    .bind(types_constants_1.default.SendEmailService)
    .to(send_email_service_1.SendEmailService)
    .inSingletonScope();
iocContainer
    .bind(types_constants_1.default.ReceviceEmailService)
    .to(recevice_email_service_1.ReceviceEmailService)
    .inSingletonScope();
