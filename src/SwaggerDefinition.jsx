import React from 'react';
import { H3, H4 } from '@blueprintjs/core';

import { PrintJson } from './PrintJson';
import { swaggerSchema } from './schema';

const { swagger, components } = swaggerSchema;

const renderComponent = name => (
  <div key={name}>
    <H4>{name}</H4>
    <PrintJson content={components.schemas[name]} />
    <br />
  </div>
);

export const SwaggerDefinition = () => (
  <>
    <H3>{'Swagger schema'}</H3>
    <PrintJson content={swagger} />
    <br />
    <H3>{'Components'}</H3>
    {Object.keys(components.schemas).map(renderComponent)}
  </>
);
