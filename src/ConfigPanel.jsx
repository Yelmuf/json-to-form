import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextArea,
  Intent,
  Callout
} from '@blueprintjs/core';
import { css } from 'emotion';

import { formatJSON } from './utils';

const prettierButtonStyle = css({
  position: 'absolute',
  top: '20px',
  right: '40px'
});

const textareaStyle = {
  height: 'calc(100vh - 100px)',
  resize: 'vertical'
};

export const ConfigPanel = ({
  textConfig,
  setConfig,
  error
}) => {
  const onChange = event => {
    setConfig(event.target.value);
  };

  const prettify = () => {
    try {
      const formattedText = formatJSON(textConfig);
      setConfig(formattedText);
    } catch {
      error = 'JSON parsing error';
    }
  };

  return (
    <div className="columns">
      <div className="column is-relative">
        <TextArea
          large
          id="config-input"
          intent={error ? Intent.DANGER : undefined}
          onChange={onChange}
          value={textConfig}
          style={textareaStyle}
          fill
        />

        <Button
          onClick={prettify}
          disabled={!!error}
          icon={'align-left'}
          className={prettierButtonStyle}
        >
          {'Prettier'}
        </Button>
      </div>
      <div className="column">
        {error && (
          <Callout
            intent={'danger'}
            title="Schema has errors"
          >
            {error.message}
          </Callout>
        )}
      </div>
    </div>
  );
};

ConfigPanel.propTypes = {
  textConfig: PropTypes.string,
  setConfig: PropTypes.func,
  error: PropTypes.object
};
