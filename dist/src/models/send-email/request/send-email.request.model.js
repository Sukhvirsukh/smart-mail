"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailRequestModel = void 0;
const lodash_1 = require("lodash");
const joi_util_1 = require("../../../utils/validation/joi.util");
const server_error_util_1 = require("../../../utils/error/server-error.util");
class SendEmailRequestModel {
    fromRequest(request) {
        try {
            SendEmailRequestModel.validateRequest(request);
            this.to = request.body.to;
            this.subject = request.body.subject;
            this.text = request.body.text;
            this.account_id = request.body.account_id;
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
            if (request.body.account_id && (0, lodash_1.isNaN)(request.body.account_id)) {
                throw 'Invalid account id';
            }
            if (!joi_util_1.JoiValidationUtil.validateEmail(request.body.to)) {
                throw 'Invalid email';
            }
        }
        catch (exception) {
            throw exception;
        }
    }
}
exports.SendEmailRequestModel = SendEmailRequestModel;
