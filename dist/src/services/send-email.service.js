"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailService = void 0;
const inversify_1 = require("inversify");
const send_email_util_1 = require("../utils/send-email/send-email.util");
const types_constants_1 = require("../constants/types.constants");
const send_emails_model_1 = require("../database/models/send-emails.model");
const email_service_1 = require("./email.service");
const server_error_util_1 = require("../utils/error/server-error.util");
let SendEmailService = class SendEmailService {
    constructor(nodemailerEmail, emailService) {
        this.nodemailerEmail = nodemailerEmail;
        this.emailService = emailService;
    }
    /**
     * this function wil send the email
     * @param sendEmailOptions
     */
    sendEmail(sendEmailRequestModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Getting account information
                const accountData = yield this.emailService.getAccountById(sendEmailRequestModel.account_id);
                if (accountData) {
                    // Varify the time time gap check
                    const isTimeGapExceeded = yield this.varifyLastSentEmailGap(sendEmailRequestModel.account_id, accountData.minimum_time_gap);
                    // Varify the number of messahe per day check
                    const isMessagePerDayAvalibable = yield this.checkMaxEmailSendLimtByAccountId(sendEmailRequestModel.account_id, accountData.messages_per_day);
                    if (isTimeGapExceeded && isMessagePerDayAvalibable) {
                        yield this.nodemailerEmail.sendEmail(sendEmailRequestModel, accountData);
                    }
                    let id = yield this.createSendEmailRecord(sendEmailRequestModel);
                    return id;
                }
                else {
                    throw 'Account not found';
                }
            }
            catch (exception) {
                let error = new server_error_util_1.ServerError(exception);
                error.status = server_error_util_1.Status.Error;
                throw error;
            }
        });
    }
    createSendEmailRecord(sendEmailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sendEmailData = yield send_emails_model_1.default.create(Object.assign({}, sendEmailOptions));
                let response = JSON.parse(JSON.stringify(sendEmailData));
                return response === null || response === void 0 ? void 0 : response.id;
            }
            catch (exception) {
                throw exception;
            }
        });
    }
    varifyLastSentEmailGap(accountId, minimumTimeGap) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastEmailSend = yield send_emails_model_1.default.findOne({
                attributes: ['created_at'],
                where: {
                    account_id: accountId,
                },
                order: [['created_at', 'DESC']],
            });
            if (lastEmailSend) {
                let lastSendEmailParsedData = JSON.parse(JSON.stringify(lastEmailSend));
                // getting current date time
                let currentDate = new Date();
                // Added given time gap in last send emails
                let createdAt = new Date(lastSendEmailParsedData.created_at);
                createdAt.setMinutes(createdAt.getMinutes() + minimumTimeGap);
                if (currentDate > createdAt) {
                    return true;
                }
                else {
                    throw `Email can be only be send after exceeding minimum time gap`;
                }
            }
            return true;
        });
    }
    /**
     * This function will calculate if user have already exceeded
     * the maximum limit for the email send and throw error
     * @param accountId
     * @param messagesPerDay
     */
    checkMaxEmailSendLimtByAccountId(accountId, messagesPerDay) {
        return __awaiter(this, void 0, void 0, function* () {
            if (accountId) {
                let emailCount = yield send_emails_model_1.default.count({
                    where: {
                        account_id: accountId,
                        created_at: new Date().getDate(),
                    },
                });
                // if email count is less than given message per day then throw error
                if (emailCount >= messagesPerDay) {
                    throw `Per day email send limit should be less than or equals to ${messagesPerDay}`;
                }
                else {
                    return true;
                }
            }
        });
    }
};
exports.SendEmailService = SendEmailService;
exports.SendEmailService = SendEmailService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_constants_1.default.NodemailerEmail)),
    __param(1, (0, inversify_1.inject)(types_constants_1.default.EmailService)),
    __metadata("design:paramtypes", [send_email_util_1.NodemailerEmail,
        email_service_1.EmailService])
], SendEmailService);
