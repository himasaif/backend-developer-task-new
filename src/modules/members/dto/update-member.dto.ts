import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export class UpdateMemberDTO {
  @JoiSchema(Joi.string().optional())
  firstName?: string;

  @JoiSchema(Joi.string().optional())
  lastName?: string;

  @JoiSchema(Joi.string().valid('male', 'female').optional())  // ✅ fix
  gender?: 'male' | 'female';

  @JoiSchema(Joi.string().isoDate().optional())  // ✅ fix
  dateOfBirth?: string;

  @JoiSchema(Joi.string().isoDate().optional())  // ✅ إضافة
  subscriptionDate?: string;

  @JoiSchema(Joi.string().optional())  // ✅ fix - optional مش required
  phone?: string;

  @JoiSchema(Joi.string().uuid().optional())  // ✅ إضافة
  centralMemberId?: string;
}