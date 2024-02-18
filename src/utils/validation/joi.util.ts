import * as Joi from 'joi'

export class JoiValidationUtil {
  public static validateEmail(email: string): boolean {
    // Schema for email validation
    const schema = Joi.string().email().required()

    // Validate the email
    const { error, value } = schema.validate(email)

    if (error) {
      return false
    } else {
      return true
    }
  }
}
