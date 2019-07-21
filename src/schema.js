import Joi from 'joi';
import { Intent } from '@blueprintjs/core';
import Joi2Swagger from 'joi-to-swagger';

const choice = Joi.object({
  label: Joi.string(),
  value: Joi.string().required()
});

const field = Joi.object({
  type: Joi.string()
    .valid(
      'number',
      'date',
      'text',
      'textarea',
      'checkbox',
      'radio'
    )
    .required(),
  label: Joi.string(),
  required: Joi.boolean(),
  placeholder: Joi.string().description(
    'Can be used when type of Field is number, date, text or textarea'
  ),
  choices: Joi.array()
    .when('type', {
      is: 'radio',
      then: Joi.array()
        .unique((a, b) => a.value === b.value)
        .items([choice])
        .required(),
      otherwise: Joi.forbidden()
    })
    .description('required only if type of Field is radio')
}).meta({ className: 'Field' });

const button = Joi.object({
  type: Joi.string().valid('submit', 'reset'),
  label: Joi.string(),
  color: Joi.string().valid(Object.values(Intent))
})
  .not({})
  .meta({ className: 'Button' });

export const configSchema = Joi.object({
  title: Joi.string(),
  subtitle: Joi.string(),
  fields: Joi.array()
    .unique((a, b) => a.key && b.key && a.key === b.key)
    .items(field),
  buttons: Joi.array()
    .items([button])
    .max(5)
});

export const validateSchema = configSchema.validate;
export const swaggerSchema = Joi2Swagger(configSchema);

export const defaultState = JSON.stringify({
  title: 'Fancy form',
  subtitle: 'Quite fancier form description',
  fields: [
    {
      label: 'Numberic form field',
      type: 'number',
      required: true
    },
    {
      label: 'Text form field',
      type: 'text',
      required: true
    },
    {
      label: 'Textarea text field filled with text',
      type: 'textarea'
    },
    {
      label: 'Textarea text field filled with text',
      type: 'textarea',
      placeholder: 'duplicate of previous one',
      required: true
    },
    {
      label: 'Date of birth',
      type: 'date',
      required: true
    },
    {
      label: 'Date of death',
      type: 'date'
    },
    {
      label: 'Checkbox field',
      type: 'checkbox'
    },
    {
      label: 'Radio fields',
      type: 'radio',
      choices: [
        {
          label: 'Kot',
          value: 'kot'
        },
        {
          label: 'Kit',
          value: 'kit'
        },
        {
          label: 'Koshka',
          value: 'koshka'
        },
        {
          label: 'Koshak',
          value: 'koshak'
        }
      ]
    }
  ],
  buttons: [
    { label: 'Cancel', type: 'reset' },
    { label: 'OK' },
    {
      label: 'Confirm',
      color: Intent.SUCCESS,
      type: 'submit'
    }
  ]
});
