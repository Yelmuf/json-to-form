import React, {
  useMemo,
  useState,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  H2,
  Card,
  Text,
  FormGroup,
  Callout,
  Intent
} from '@blueprintjs/core';
import { Field, Form } from 'react-final-form';
import { css } from 'emotion';

import * as fields from './fields';
import {
  mapSubmitData,
  parseDate,
  indexToName
} from './form';
import { PrintJson } from './PrintJson';
import { withDefault } from './utils';
import testid from './testid';

const fieldsByType = {
  number: fields.NumberInput,
  text: fields.Text,
  textarea: fields.TextArea
};

const renderField = (
  { label, type, choices, placeholder },
  index
) => {
  const name = indexToName(index);

  switch (type) {
    case 'checkbox':
      return (
        <FormGroup key={name}>
          <Field
            name={name}
            type="checkbox"
            render={fields.Checkbox}
            label={label}
            parse={withDefault(undefined)}
          />
        </FormGroup>
      );

    case 'date':
      return (
        <FormGroup key={name} label={label}>
          <Field
            name={name}
            render={fields.DateInput}
            parse={parseDate}
            // To display 'not selected' date in date picker value should be null
            format={withDefault(null)}
            placeholder={placeholder}
          />
        </FormGroup>
      );

    case 'radio':
      return (
        <Field
          key={name}
          name={name}
          label={label}
          component={fields.Radio}
          choices={choices}
        />
      );

    default:
      return (
        <FormGroup key={name} label={label}>
          <Field
            name={name}
            render={fieldsByType[type] || fields.Text}
            placeholder={placeholder}
          />
        </FormGroup>
      );
  }
};

const buttonsStyle = css({
  display: 'flex',
  justifyContent: 'flex-end',
  '>:not(:last-child)': {
    marginRight: '5px'
  }
});

const renderButton = actionByType => (
  { label, type, color },
  index
) => (
  <Button
    key={index}
    type={'button'}
    intent={color}
    {...actionByType[type]}
  >
    {label}
  </Button>
);

const FormBody = ({ handleSubmit, form, config = {} }) => {
  const actionByType = useMemo(
    () => ({
      reset: { onClick: form.reset },
      submit: { type: 'submit' }
    }),
    [form.reset]
  );

  const {
    fields = [],
    buttons = []
  } = config;

  return (
    <form
      {...testid.form}
      onSubmit={handleSubmit}
    >
      {fields.map(renderField)}

      {buttons && (
        <div className={buttonsStyle}>
          {buttons.map(renderButton(actionByType))}
        </div>
      )}
    </form>
  );
};

FormBody.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  config: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
      choices: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
      }))
    })),
    buttons: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      color: PropTypes.string
    }))
  })
};

const cardStyle = css({
  maxWidth: '500px'
});

const codeStyle = css({
  padding: 0,
  backgroundColor: 'initial'
});

export const FormPanel = ({ config = {} }) => {
  const [result, setResult] = useState(null);

  const onSubmit = useCallback(
    values =>
      setResult(mapSubmitData(config.fields, values)),
    [config.fields]
  );

  if (typeof config !== 'object') {
    return 'Error in config';
  }

  return (
    <div className="columns">
      <div className="column">
        <Card elevation={3} className={cardStyle}>
          {config.title && <H2>{config.title}</H2>}
          {config.subtitle && (
            <>
              <Text>{config.subtitle}</Text>
              <br />
            </>
          )}
          <Form
            onSubmit={onSubmit}
            component={FormBody}
            config={config}
          />
        </Card>
      </div>
      <div className="column">
        {result && (
          <Callout
            intent={Intent.SUCCESS}
            title="Form submitted"
          >
            <PrintJson
              {...testid.submitResult}
              className={codeStyle}
              content={result}
            />
          </Callout>
        )}
      </div>
    </div>
  );
};

FormPanel.propTypes = {
  config: PropTypes.object
};
