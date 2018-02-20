import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

// const endPoint = 'http://localhost:5555/graphql';
const endPoint = 'http://ec2-54-95-51-123.ap-northeast-1.compute.amazonaws.com/graphql';

const tokenLink = setContext((req, { headers }) => {
  const xtoken = localStorage.getItem('xtoken');

  return {
    ...headers,
    headers: {
      // 'x-token': xtoken ? `Bearer ${xtoken}` : null,
      'x-token': xtoken ? `${xtoken}` : null,
    },
  };
});

const httpLink = new HttpLink({ uri: endPoint });

const linkWithToken = tokenLink.concat(httpLink);

// const httpLink = new HttpLink({ uri: 'https://q815p14lp.lp.gql.zone/graphql' });
// const authLink = setContext(async (req, { headers }) => {
//   const token = await getToken();

//   return {
//     ...headers,
//     headers: {
//       authorization: token ? `Bearer ${token}` : null,
//     },
//   };
// });

// const link = authLink.concat(httpLink);
// const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// });

const ws = 'ws://ec2-54-95-51-123.ap-northeast-1.compute.amazonaws.com/subscriptions';
const wsLink = new WebSocketLink({
  uri: ws,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionCallback: error => {
      console.log('ws connention callback', error);
      return null;
    },
    connectionParams: {
      xtoken: localStorage.getItem('xtoken'),
    },
  },
});

// console.log('wsLink', wsLink);

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  linkWithToken
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

// test for
// client
//   .query({
//     query: gql`
//       {
//         allUsers {
//           name
//         }
//       }
//     `,
//   })
//   .then(console.log);

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
