import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
// console.log(process.env)
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
Sentry.init({
  dsn: "https://9d33d9d8ec604257acc16be7ba564ea8@o1322077.ingest.sentry.io/6579382",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
export const sendErrorToSentry = ({ name, message, extra, tags }) => {
  const error = new Error();
  error.message = message;
  error.name = name;
  if (!tags) tags = {};
  // Sentry called
  Sentry.captureException(error, {
    tags,
    extra,
  });
};
const httpLink = new HttpLink({
  uri: 'https://wondrous-krill-11.hasura.app/v1/graphql',
  headers: {
    // 'x-hasura-access-key': process.env.REACT_APP_DB_CONNECTION,
    'x-hasura-access-key': 'VzdA69N77Vi2SW6v8Ws7d7MDqzpH6kejBK1nZe5xsC0xy3ltAf2lqeXZ70aZnAHq',

  }
});


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

ReactDOM.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  // </React.StrictMode>,,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
