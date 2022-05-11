import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';
import './index.css';
import Root from './components/Root';
import * as serviceWorker from './serviceWorker';

import '@graasp/ui/dist/bundle.css';
import { ENV, GA_MEASUREMENT_ID, NODE_ENV } from './config/constants';
import { hasAcceptedCookies } from './utils/cookies';

if (GA_MEASUREMENT_ID && hasAcceptedCookies() && NODE_ENV !== ENV.TEST) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
