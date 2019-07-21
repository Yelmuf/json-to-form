import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  getNodeText
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { printJSON } from '../utils';
import { testId } from '../testid';

import { App } from '../App';


afterEach(cleanup);

const setup = () => {
  const utils = render(<App />);

  const app = {
    configTab: () => utils.container.querySelector('[data-tab-id="Config"]'),
    resultTab: () => utils.container.querySelector('[data-tab-id="Result"]'),
    swaggerTab: () => utils.container.querySelector('[data-tab-id="API"]'),
    configInput: () => utils.container.querySelector('textarea#config-input'),
    form: () => utils.getByTestId(testId.form),
    submitForm: () => fireEvent.click(utils.container.querySelector('button[type=submit]')),
    resetForm: () => fireEvent.click(utils.getByText('Reset-button').parentElement),
    submitResult: () => getNodeText(utils.getByTestId(testId.submitResult))
  };

  return {
    app,
    ...utils
  };
}

const changeInputValue = (node, value) => fireEvent.change(node, { target: { value } });

describe('Renders and switches tabs without crashing', () => {
  it('Config input tab', () => {
    const { app } = setup();
    expect(app.configInput()).not.toBeNull();
  });
  
  it('Result tab', () => {
    const { app } = setup();
    
    fireEvent.click(app.resultTab());
    
    expect(app.configInput()).toBeNull();
    expect(app.form()).not.toBeNull();
  });

  it('Swagger tab', () => {
    const { app, getByText } = setup();
    
    fireEvent.click(app.swaggerTab());
    
    expect(app.configInput()).toBeNull();
    expect(getByText('Swagger schema')).toBeInTheDocument();
  });
});

const setupWithConfig = value => {
  const config = typeof value === 'string' ? value : JSON.stringify(value);
  const { app, ...utils } = setup();

  changeInputValue(app.configInput(), config);

  fireEvent.click(app.resultTab());

  return {
    app,
    ...utils
  };
}

const testReset = app => {
  app.resetForm();
  app.submitForm();
  expect(app.submitResult()).toEqual('[]');
};

describe('Test form configs:', () => {
  const buttons = [{
    type: 'reset',
    label: 'Reset-button'
  }, {
    type: 'submit',
    label: 'Submit-button'
  }];

  it('Empty form submit', () => {
    const { app, getByText, container } = setupWithConfig({
      buttons: [{
        type: 'submit',
        label: 'Submit-button'
      }]
    });

    expect(getNodeText(container.querySelector('button[type=submit]').firstChild)).toEqual('Submit-button');

    app.submitForm();

    expect(getByText('Form submitted')).not.toBeNull();
    expect(app.submitResult()).toEqual('[]');
  });

  it('Invalid form config (json)', () => {
    const { app, getByText } = setupWithConfig('{ invalid config :<');

    expect(app.configInput()).toBeInTheDocument();

   expect(getByText('Schema has errors')).toBeInTheDocument();
    expect(getByText('Config is not a valid JSON')).toBeInTheDocument();
  });

  it('Invalid form config (schema)', () => {
    const { app, getByText } = setupWithConfig({
      unknownProp: 'unknown'
    });

    // Here we have already tested disabled "Result" tab button 
    expect(app.configInput()).toBeInTheDocument();

    expect(getByText('Schema has errors')).toBeInTheDocument();
    expect(getByText('"unknownProp" is not allowed')).toBeInTheDocument();
    
    changeInputValue(app.configInput(), JSON.stringify({ fields: [{ type: 'oop' }] }));
    expect(getByText('Schema has errors')).toBeInTheDocument();
    expect(getByText('child "fields" fails because ["fields" at position 0 fails because [child "type" fails because ["type" must be one of [number, date, text, textarea, checkbox, radio]]]]')).toBeInTheDocument();
  });

  it('Text field', () => {
    const { app, getByText } = setupWithConfig({
      fields: [{
        type: 'text',
        label: 'text-label',
        placeholder: 'text-placeholder'
      }],
      buttons
    });

    const input = getByText('text-label').nextSibling.querySelector('input');
    
    expect(input).not.toBeNull();
    expect(input.placeholder).toEqual('text-placeholder');

    changeInputValue(input, 'sample input text inside field');
    expect(input.value).toEqual('sample input text inside field');

    app.submitForm();
    expect(app.submitResult()).toEqual(printJSON([{ label: 'text-label', value: 'sample input text inside field' }]));

    testReset(app);
  });

  it('Title & subtitle', () => {
    const { app, getByText } = setupWithConfig({
      title: 'Title-text',
      subtitle: 'Subtitle-text',
      buttons
    });

    expect(getByText('Title-text')).toBeInTheDocument();
    expect(getByText('Subtitle-text')).toBeInTheDocument();
  });

  it('Textarea field', () => {
    const { app, getByText } = setupWithConfig({
      fields: [{
        type: 'textarea',
        label: 'textarea-label',
        placeholder: 'textarea-placeholder'
      }],
      buttons
    });

    const textarea = getByText('textarea-label').nextSibling.querySelector('textarea');
    
    expect(textarea).not.toBeNull();
    expect(textarea.placeholder).toEqual('textarea-placeholder');

    changeInputValue(textarea, 'sample input text inside field');
    expect(textarea.value).toEqual('sample input text inside field');

    app.submitForm();

    expect(app.submitResult()).toEqual(printJSON([{ label: 'textarea-label', value: 'sample input text inside field' }]));
    testReset(app);
  });
  
  it('Number field', () => {
    const { app, getByText } = setupWithConfig({
      fields: [{
        type: 'number',
        label: 'number-label',
        placeholder: 'number-placeholder'
      }],
      buttons
    });

    const numberField = getByText('number-label').nextSibling.querySelector('input');
    
    expect(numberField).not.toBeNull();
    expect(numberField.placeholder).toEqual('number-placeholder');

    changeInputValue(numberField, 5789);
    expect(numberField.value).toEqual('5789');

    app.submitForm();

    expect(app.submitResult()).toEqual(printJSON([{ label: 'number-label', value: 5789 }]));
    testReset(app);
  });

  it('Checkbox field', () => {
    const { app, getByText } = setupWithConfig({
      fields: [{
        type: 'checkbox',
        label: 'checkbox-label'
      }],
      buttons
    });

    const checkboxField = getByText('checkbox-label').parentElement.querySelector('input[type=checkbox]');
    
    expect(checkboxField).not.toBeNull();
    expect(checkboxField.checked).toBeFalsy();

    fireEvent.click(checkboxField);
    expect(checkboxField.checked).toBeTruthy();
    
    app.submitForm();
    expect(app.submitResult()).toEqual(printJSON([{ label: 'checkbox-label', value: true }]));

    fireEvent.click(checkboxField);
    expect(checkboxField.checked).toBeFalsy();

    app.submitForm();
    expect(app.submitResult()).toEqual(printJSON([]));
    testReset(app);
  });

  it('Radio field', () => {
    const { app, getByText } = setupWithConfig({
      fields: [{
        type: 'radio',
        label: 'radio-label',
        choices: [{
          label: 'radio-label-0',
          value: 'radio-value-0'
        }, {
          label: 'radio-label-1',
          value: 'radio-value-1'
        }]
      }],
      buttons
    });

    expect(getByText('radio-label')).toBeInTheDocument();
    
    const radioFields = [
      getByText('radio-label-0').querySelector('input[type=radio]'),
      getByText('radio-label-1').querySelector('input[type=radio]'),
    ];

    expect(radioFields[0].value).toEqual('radio-value-0');
    expect(radioFields[1].value).toEqual('radio-value-1');

    fireEvent.click(radioFields[0]);
    
    app.submitForm();
    expect(app.submitResult()).toEqual(printJSON([{ label: 'radio-label', value: 'radio-value-0' }]));

    fireEvent.click(radioFields[1]);

    app.submitForm();
    expect(app.submitResult()).toEqual(printJSON([{ label: 'radio-label', value: 'radio-value-1' }]));
    testReset(app);
  });

  it('Date field', () => {
    const { app, getByText } = setupWithConfig({
      fields: [{
        type: 'date',
        label: 'date-label',
        placeholder: 'date-placeholder'
      }],
      buttons
    });

    const dateField = getByText('date-label').nextSibling.querySelector('input');
    
    expect(dateField).not.toBeNull();
    expect(dateField.placeholder).toEqual('date-placeholder');

    changeInputValue(dateField, '03/07/1985');
    expect(dateField.value).toEqual('03/07/1985');

    app.submitForm();

    expect(app.submitResult()).toEqual(printJSON([{ label: 'date-label', value: '03/07/1985' }]));
    testReset(app);
  });
});
