import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import 'bulma/css/bulma.min.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

import { App } from './App';

Sentry.init({ dsn: "https://24b8ef37b8fd4a06ab2b0d8205814675@sentry.io/1329204" });

ReactDOM.render(<App />, document.getElementById('root'));
