import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

const AVAILABILITY = ['busy', 'open', 'closed'] as const;

export class CreateShopDTO {
  @JoiSchema(Joi.string().trim().min(1).required())
  name: string;

  @JoiSchema(
    Joi.string()
      .pattern(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
      .required()
      .messages({ 'string.pattern.base': 'openingHour must be in HH:MM:SS format' })
  )
  openingHour: string;

  @JoiSchema(
    Joi.string()
      .pattern(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
      .required()
      .messages({ 'string.pattern.base': 'closingHour must be in HH:MM:SS format' })
  )
  closingHour: string;

  @JoiSchema(
    Joi.string()
      .valid(...AVAILABILITY)
      .required(),
  )
  availability: 'busy' | 'open' | 'closed';
}