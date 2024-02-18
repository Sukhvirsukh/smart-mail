"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailResponseModel = void 0;
const server_error_util_1 = require("../../../utils/error/server-error.util");
class SendEmailResponseModel {
    fromResponse(request) {
        try {
            this.to = request.body.to;
            this.subject = request.body.subject;
            this.text = request.body.text;
            this.account_id = request.body.account_id;
        }
        catch (exception) {
            let error = new server_error_util_1.ServerError(exception.message);
            error.status = server_error_util_1.Status.BadRequest;
        }
    }
}
exports.SendEmailResponseModel = SendEmailResponseModel;
