import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';

const endPoint = 'http://localhost:5555/graphql';
const client = new ApolloClient({
  link: new HttpLink({ uri: endPoint }),
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      {
        books {
          title
        }
      }
    `,
  })
  .then(console.log);

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
