import React from 'react';
import PropTypes from 'prop-types';

import { printJSON } from './utils';

export const PrintJson = ({ content, ...props }) => (
  <pre {...props}>{printJSON(content)}</pre>
);

PrintJson.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  className: PropTypes.string
};
