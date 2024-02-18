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
exports.ReceviceEmailService = void 0;
const inversify_1 = require("inversify");
const types_constants_1 = require("../constants/types.constants");
const email_service_1 = require("./email.service");
const receive_email_model_1 = require("../database/models/receive-email.model");
const recevice_email_model_1 = require("../models/recevice-email/recevice-email.model");
const server_error_util_1 = require("../utils/error/server-error.util");
const Imap = require('imap');
const { simpleParser } = require('mailparser');
let ReceviceEmailService = class ReceviceEmailService {
    constructor(emailService) {
        this.emailService = emailService;
    }
    receviceEmail(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Getting account information
                const accountData = yield this.emailService.getAccountById(accountId);
                if (accountData) {
                    let data = yield this.receviceImapEmail(accountData);
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
    createBulkEmail(bulkData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Insert the bulk data into the receive_email table
                yield receive_email_model_1.default.bulkCreate(bulkData);
                console.log('Bulk data insertion completed successfully');
            }
            catch (error) {
                console.error('Error inserting bulk data:', error);
            }
        });
    }
    receviceImapEmail(accountResponseModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let acconutId = accountResponseModel.account_id;
                let emails = [];
                let user = accountResponseModel.from_email;
                let host = accountResponseModel.imap_host;
                // IMAP server configuration
                let imapConfig = {
                    user: user,
                    password: accountResponseModel.password,
                    host: host,
                    port: 993,
                    tls: true,
                };
                const imap = new Imap(imapConfig);
                let conut = 0;
                imap.once('ready', () => {
                    imap.openBox('INBOX', false, (err, box) => {
                        if (err) {
                            throw `Error opening mailbox:', ${err}`;
                        }
                        const searchCriteria = ['UNSEEN']; // Fetch unseen emails
                        const fetchOptions = { bodies: '', markSeen: true }; // Fetch email bodies and mark emails as seen
                        imap.search(searchCriteria, (searchErr, results) => {
                            if (searchErr) {
                                console.error('Error searching for emails:', searchErr);
                            }
                            conut = results.length;
                            const fetch = imap.fetch(results, fetchOptions);
                            fetch.on('message', (msg) => {
                                const emailData = { headers: {} };
                                msg.on('body', (stream) => {
                                    let body = '';
                                    stream.on('data', (chunk) => {
                                        body += chunk.toString('utf8');
                                    });
                                    stream.once('end', () => {
                                        emailData['body'] = body;
                                    });
                                });
                                msg.once('attributes', (attrs) => {
                                    emailData.headers = attrs.struct;
                                });
                                msg.once('end', () => {
                                    // Extract desired fields and store in an object
                                    if (emailData['body']) {
                                        simpleParser(emailData['body'], (err, parsed) => __awaiter(this, void 0, void 0, function* () {
                                            var _a, _b, _c;
                                            if (err) {
                                                console.error('Error parsing email body:', err);
                                                return;
                                            }
                                            let email = new recevice_email_model_1.ReceviceEmailModel();
                                            email.date_time = parsed === null || parsed === void 0 ? void 0 : parsed.date;
                                            email.subject = parsed === null || parsed === void 0 ? void 0 : parsed.subject;
                                            email.html = parsed === null || parsed === void 0 ? void 0 : parsed.html;
                                            email.text = parsed === null || parsed === void 0 ? void 0 : parsed.text;
                                            email.account_id = acconutId;
                                            if ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.from) === null || _a === void 0 ? void 0 : _a.text) {
                                                email.from_email = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.from) === null || _b === void 0 ? void 0 : _b.value[0].address;
                                                email.user_name = (_c = parsed === null || parsed === void 0 ? void 0 : parsed.from) === null || _c === void 0 ? void 0 : _c.value[0].name;
                                            }
                                            emails.push(email);
                                            if (conut == emails.length) {
                                                yield this.createBulkEmail(emails);
                                            }
                                        }));
                                    }
                                });
                            });
                            fetch.once('error', (fetchErr) => {
                                console.error('Error fetching emails:', fetchErr);
                            });
                            fetch.once('end', () => {
                                imap.end();
                            });
                        });
                    });
                });
                imap.once('error', (err) => {
                    console.error('IMAP error:', err);
                });
                imap.once('end', (err) => {
                    console.error('IMAP error:', err);
                });
                imap.connect();
            }
            catch (exception) {
                let error = new server_error_util_1.ServerError(exception);
                error.status = server_error_util_1.Status.Error;
                throw error;
            }
        });
    }
    getReceiveEmail(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receiveEmail = yield receive_email_model_1.default.findAll({
                    where: { account_id: accountId },
                });
                if (receiveEmail.length > 0) {
                    yield this.deleteReceiveEmail(accountId);
                    let emails = JSON.parse(JSON.stringify(receiveEmail));
                    return emails;
                }
                else {
                    throw 'No new email received';
                }
            }
            catch (exception) {
                let error = new server_error_util_1.ServerError(exception);
                error.status = server_error_util_1.Status.Error;
                throw error;
            }
        });
    }
    deleteReceiveEmail(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let test = yield receive_email_model_1.default.destroy({
                    where: { account_id: accountId },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.ReceviceEmailService = ReceviceEmailService;
exports.ReceviceEmailService = ReceviceEmailService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_constants_1.default.EmailService)),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], ReceviceEmailService);
