import React from 'react';
import { Checkbox as BPCheckbox } from '@blueprintjs/core';

export const Checkbox = ({ input, label, value }) => (
  <BPCheckbox label={label} {...input} value={value} />
);
