"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.ServerError = void 0;
class ServerError extends Error {
}
exports.ServerError = ServerError;
var Status;
(function (Status) {
    Status[Status["OK"] = 200] = "OK";
    Status[Status["Created"] = 201] = "Created";
    Status[Status["NoData"] = 204] = "NoData";
    Status[Status["NotModifed"] = 304] = "NotModifed";
    Status[Status["BadRequest"] = 400] = "BadRequest";
    Status[Status["NotAuthorized"] = 401] = "NotAuthorized";
    Status[Status["NotFound"] = 404] = "NotFound";
    Status[Status["ImATeapot"] = 418] = "ImATeapot";
    Status[Status["Error"] = 500] = "Error";
})(Status || (exports.Status = Status = {}));
