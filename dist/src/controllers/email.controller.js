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
exports.EmailController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const email_service_1 = require("../services/email.service");
const types_constants_1 = require("../constants/types.constants");
const account_request_model_1 = require("../models/account/request/account.request.model");
const server_error_util_1 = require("../utils/error/server-error.util");
const send_email_request_model_1 = require("../models/send-email/request/send-email.request.model");
const send_email_service_1 = require("../services/send-email.service");
const recevice_email_service_1 = require("../services/recevice-email.service");
let EmailController = class EmailController {
    constructor(emailService, sendEmailService, receviceEmailService) {
        this.emailService = emailService;
        this.sendEmailService = sendEmailService;
        this.receviceEmailService = receviceEmailService;
    }
    createAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validating and preparing the model
                const accountRequest = new account_request_model_1.default();
                accountRequest.fromRequest(request);
                // Creating the account
                const accountId = yield this.emailService.createAccount(accountRequest);
                // Preparing the reponse
                response.status(201).json({
                    status: server_error_util_1.Status.Created,
                    accountId: accountId,
                });
            }
            catch (error) {
                const status = error.status ? error.status : server_error_util_1.Status.Error;
                const message = error.message ? error.message : 'Something went wrong';
                response.status(status).json({
                    message: message,
                    status: status,
                });
            }
        });
    }
    sendEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sendEmailRequestModel = new send_email_request_model_1.SendEmailRequestModel();
                sendEmailRequestModel.fromRequest(request);
                const emailSendId = yield this.sendEmailService.sendEmail(sendEmailRequestModel);
                response.status(201).json({
                    status: server_error_util_1.Status.Created,
                    Id: emailSendId,
                });
            }
            catch (error) {
                const status = error.status ? error.status : server_error_util_1.Status.Error;
                const message = error.message ? error.message : 'Something went wrong';
                response.status(status).json({
                    message: message,
                    status: status,
                });
            }
        });
    }
    syncEmail(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((_a = request.query) === null || _a === void 0 ? void 0 : _a.id) {
                    let accountId = parseInt((_b = request.query) === null || _b === void 0 ? void 0 : _b.id.toString());
                    const emailSendId = yield this.receviceEmailService.receviceEmail(accountId);
                    response.status(201).json({
                        status: server_error_util_1.Status.Created,
                        Id: emailSendId,
                    });
                }
                else {
                    throw 'accountId query parameter is required';
                }
            }
            catch (error) {
                const status = error.status ? error.status : server_error_util_1.Status.Error;
                const message = error.message ? error.message : 'Something went wrong';
                response.status(status).json({
                    message: message,
                    status: status,
                });
            }
        });
    }
    getReceiveEmail(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((_a = request.query) === null || _a === void 0 ? void 0 : _a.id) {
                    let accountId = parseInt((_b = request.query) === null || _b === void 0 ? void 0 : _b.id.toString());
                    const receiveEmail = yield this.receviceEmailService.getReceiveEmail(accountId);
                    response.status(200).json({
                        receiveEmail: receiveEmail,
                    });
                }
                else {
                    throw 'accountId query parameter is required';
                }
            }
            catch (error) {
                const status = error.status ? error.status : server_error_util_1.Status.Error;
                const message = error.message ? error.message : 'Something went wrong';
                response.status(status).json({
                    message: message,
                    status: status,
                });
            }
        });
    }
    emailTracking(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO: need to add tracking code here
            }
            catch (error) {
                const status = error.status ? error.status : server_error_util_1.Status.Error;
                const message = error.message ? error.message : 'Something went wrong';
                response.status(status).json({
                    message: message,
                    status: status,
                });
            }
        });
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/create-account'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "createAccount", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/send-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendEmail", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/sync-emails'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "syncEmail", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/get-receive-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getReceiveEmail", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/track:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "emailTracking", null);
exports.EmailController = EmailController = __decorate([
    (0, inversify_express_utils_1.controller)('/email'),
    __param(0, (0, inversify_1.inject)(types_constants_1.default.EmailService)),
    __param(1, (0, inversify_1.inject)(types_constants_1.default.SendEmailService)),
    __param(2, (0, inversify_1.inject)(types_constants_1.default.ReceviceEmailService)),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        send_email_service_1.SendEmailService,
        recevice_email_service_1.ReceviceEmailService])
], EmailController);
