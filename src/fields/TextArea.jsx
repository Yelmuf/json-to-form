import React from 'react';
import { TextArea as BPTextArea } from '@blueprintjs/core';

const textareaStyle = {
  resize: 'vertical'
};

export const TextArea = ({ input, placeholder }) => (
  <BPTextArea
    {...input}
    growVertically
    fill
    style={textareaStyle}
    placeholder={placeholder}
  />
);
