"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.NodemailerEmail = void 0;
const inversify_1 = require("inversify");
const nodemailer = require('nodemailer');
const common_enums_1 = require("../../constants/common.enums");
let NodemailerEmail = class NodemailerEmail {
    /**
     * This function will send the email using SMTP
     * @param options
     */
    sendEmail(sendEmailRequestModel, accountResponseModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let host = accountResponseModel.smtp_host;
                let port = accountResponseModel.smtp_port;
                let isSecure = false; // false for TLS, true for SSL
                if (accountResponseModel.communication_protocol == common_enums_1.ProtocolEnum.SSL) {
                    isSecure = true;
                }
                //SMTP settings
                const transporter = nodemailer.createTransport({
                    host: host,
                    port: port,
                    secure: isSecure,
                    auth: {
                        user: accountResponseModel.from_email,
                        pass: accountResponseModel.password,
                    },
                    from: accountResponseModel.from_email,
                });
                // Send email
                yield transporter.sendMail(sendEmailRequestModel);
                console.log('Email sent successfully');
            }
            catch (error) {
                console.error('Error sending email:', error);
                throw error;
            }
        });
    }
};
exports.NodemailerEmail = NodemailerEmail;
exports.NodemailerEmail = NodemailerEmail = __decorate([
    (0, inversify_1.injectable)()
], NodemailerEmail);
