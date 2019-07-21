import React from 'react';
import { DateInput as BPDateInput } from '@blueprintjs/datetime';
import moment from 'moment';

import { DATE_FORMAT } from '../form';

const dateFormatter = {
  formatDate: date => moment(date).format(DATE_FORMAT),
  parseDate: str => moment(str, DATE_FORMAT).toDate(),
  minDate: moment()
    .subtract(100, 'y')
    .toDate(),
  maxDate: moment()
    .add(100, 'y')
    .toDate()
};

export const DateInput = ({
  input: { value, ...inputProps },
  placeholder = DATE_FORMAT
}) => (
  <BPDateInput
    canClearSelection
    showActionsBar
    {...inputProps}
    {...dateFormatter}
    placeholder={placeholder}
    value={!value ? null : dateFormatter.parseDate(value)}
  />
);
