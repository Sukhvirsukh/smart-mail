"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const joi_util_1 = require("../../../utils/validation/joi.util");
const server_error_util_1 = require("../../../utils/error/server-error.util");
class AccountRequestModel {
    fromRequest(request) {
        try {
            AccountRequestModel.validateRequest(request);
            this.first_name = request.body.first_name;
            this.user_name = request.body.user_name;
            this.from_email = request.body.from_email;
            this.password = request.body.password;
            this.smtp_host = request.body.smtp_host;
            this.smtp_port = request.body.smtp_port;
            this.communication_protocol = request.body.communication_protocol;
            this.messages_per_day = request.body.messages_per_day;
            this.minimum_time_gap = request.body.minimum_time_gap;
            this.imap_host = request.body.imap_host;
            this.imap_port = request.body.imap_port;
        }
        catch (exception) {
            let error = new server_error_util_1.ServerError(exception);
            error.status = server_error_util_1.Status.BadRequest;
            throw error;
        }
    }
    static validateRequest(request) {
        try {
            if ((0, lodash_1.isEmpty)(request.body)) {
                throw 'Invalid request. Missing request object.';
            }
            if (!request.body.first_name &&
                !request.body.user_name &&
                !request.body.from_email &&
                !request.body.password &&
                !request.body.smtp_host &&
                !request.body.smtp_port &&
                !request.body.communication_protocol &&
                !request.body.minimum_time_gap &&
                !request.body.messages_per_day &&
                !request.body.imap_host) {
                throw 'All fields are required';
            }
            if ((0, lodash_1.isNaN)(request.body.smtp_port) &&
                (0, lodash_1.isNaN)(request.body.minimum_time_gap) &&
                (0, lodash_1.isNaN)(request.body.messages_per_day)) {
                throw 'smtp_port, minimum_time_gap, messages_per_day should have nummaric value';
            }
            // if (!request.body.account_id && !isNaN(request.body.account_id)) {
            //   throw 'Invalid account id';
            // }
            if (!joi_util_1.JoiValidationUtil.validateEmail(request.body.from_email)) {
                throw 'Invalid email';
            }
        }
        catch (exception) {
            throw exception;
        }
    }
}
exports.default = AccountRequestModel;
