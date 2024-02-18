"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiValidationUtil = void 0;
const Joi = require("joi");
class JoiValidationUtil {
    static validateEmail(email) {
        // Schema for email validation
        const schema = Joi.string().email().required();
        // Validate the email
        const { error, value } = schema.validate(email);
        if (error) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.JoiValidationUtil = JoiValidationUtil;
