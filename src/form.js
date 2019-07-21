import moment from 'moment';

export const DATE_FORMAT = 'DD/MM/YYYY';
const FORM_KEY = 'form-field-';

export const indexToName = index => `${FORM_KEY}${index}`;
const nameToIndex = (name = '') =>
  Number(name.replace(FORM_KEY, ''));

// To omit value in form onSubmit, value should be undefined
export const parseDate = value =>
  value ? moment(value).format(DATE_FORMAT) : undefined;

export const mapSubmitData = (fields, values) =>
  Object.keys(values)
    .map(nameToIndex)
    .sort((a, b) => a - b)
    .map(index => ({
      label: fields[index].label,
      value: values[indexToName(index)]
    }));
