import React, { useCallback } from 'react';
import { RadioGroup } from '@blueprintjs/core';

export const Radio = ({ input, label, choices }) => {
  const onChange = useCallback(
    e => input.onChange(e.currentTarget.value),
    [input]
  );

  return (
    <RadioGroup
      label={label}
      onChange={onChange}
      selectedValue={input.value}
      options={choices}
    />
  );
};
