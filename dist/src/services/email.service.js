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
exports.EmailService = void 0;
const inversify_1 = require("inversify");
const account_model_1 = require("../database/models/account.model");
const server_error_util_1 = require("../utils/error/server-error.util");
let EmailService = class EmailService {
    constructor() { }
    createAccount(sendEmailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isAccountExist = yield this.getAccountByEmail(sendEmailOptions.from_email);
                if (isAccountExist) {
                    throw `Account already exists with email address ${sendEmailOptions.from_email}`;
                }
                const account = yield account_model_1.default.create(Object.assign({}, sendEmailOptions));
                let type = JSON.parse(JSON.stringify(account));
                return type === null || type === void 0 ? void 0 : type.account_id;
            }
            catch (exception) {
                let error = new server_error_util_1.ServerError(exception);
                error.status = server_error_util_1.Status.Error;
                throw error;
            }
        });
    }
    getAccountById(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield account_model_1.default.findByPk(accountId);
                if (account) {
                    return JSON.parse(JSON.stringify(account));
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAccountByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield account_model_1.default.findOne({ where: { from_email: email } });
                if (account) {
                    return JSON.parse(JSON.stringify(account));
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
