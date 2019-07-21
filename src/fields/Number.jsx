import React from 'react';
import { NumericInput } from '@blueprintjs/core';

export const NumberInput = ({ input, placeholder }) => (
  <NumericInput
    {...input}
    onValueChange={input.onChange}
    placeholder={placeholder}
  />
);
