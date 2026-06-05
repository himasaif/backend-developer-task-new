import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

const AVAILABILITY = ['busy', 'open', 'closed'] as const;

export class UpdateShopDTO {
  @JoiSchema(
    Joi.string()
      .trim()
      .min(1)
      .max(255)
      .optional(),
  )
  name?: string;

  @JoiSchema(
    Joi.string()
      .pattern(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
      .messages({ 'string.pattern.base': 'openingHour must be in HH:MM:SS format' })
      .optional(),
  )
  openingHour?: string;

  @JoiSchema(
    Joi.string()
      .pattern(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
      .messages({ 'string.pattern.base': 'closingHour must be in HH:MM:SS format' })
      .optional(),
  )
  closingHour?: string;

  @JoiSchema(
    Joi.string()
      .valid(...AVAILABILITY)
      .optional(),
  )
  availability?: 'busy' | 'open' | 'closed';
}