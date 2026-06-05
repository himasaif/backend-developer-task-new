import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateMemberDTO {
  @JoiSchema(Joi.string().required())
  firstName: string;

  @JoiSchema(Joi.string().required())
  lastName: string;

  @JoiSchema(Joi.string().valid('male', 'female').required())  
  gender: 'male' | 'female';

  @JoiSchema(Joi.string().isoDate().required())  
  dateOfBirth: string;

  @JoiSchema(Joi.string().isoDate().required())  
  subscriptionDate: string;

  @JoiSchema(Joi.string().optional())
  phone?: string;

  @JoiSchema(Joi.string().uuid().optional())  
  centralMemberId?: string;
}