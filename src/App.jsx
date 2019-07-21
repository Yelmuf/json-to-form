import React, { useState } from 'react';
import { H5, Tabs, Tab, Icon } from '@blueprintjs/core';
import { css } from 'emotion';

import { ConfigPanel } from './ConfigPanel';
import { FormPanel } from './FormPanel';
import { configSchema, defaultState } from './schema';
import { SwaggerDefinition } from './SwaggerDefinition';

const tabsStyle = css({
  padding: '20px'
});

export function App() {
  const [textConfig, setTextConfig] = useState(
    defaultState
  );

  let config, error;

  try {
    config = JSON.parse(textConfig);
    const { error: schemaError } = configSchema.validate(
      config
    );
    error = schemaError;
  } catch {
    error = new Error('Config is not a valid JSON');
  }

  return (
    <div className="container">
      <Tabs
        id="Tabs"
        animate
        large
        renderActiveTabPanelOnly
        className={tabsStyle}
      >
        <Tab
          id="Config"
          panel={
            <ConfigPanel
              error={error}
              textConfig={textConfig}
              setConfig={setTextConfig}
            />
          }
        >
          <H5>{'Config'}</H5>
        </Tab>
        <Tab
          id="Result"
          disabled={!!error}
          panel={
            <FormPanel config={config} error={error} />
          }
        >
          <H5>{'Result'}</H5>
        </Tab>
        <Tab id="API" panel={<SwaggerDefinition />}>
          <H5>
            <Icon icon={'info-sign'} />
          </H5>
        </Tab>
      </Tabs>
    </div>
  );
}
