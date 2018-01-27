import React, { Component } from 'react';
import { Item, Label, Button } from 'semantic-ui-react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import MessageItem from './MessageItem';

import ava from '../jenny.jpg';

const paragraph = 'lorem sjdklf sadljkf';

const newMessageSubscription = gql`
  subscription($userId: String!) {
    newMessageAdded(userId: $userId) {
      content
      userId
      createdAt
      _id
      votes {
        userId
      }
      owner
    }
  }
`;
class MessageContainer extends Component {
  componentWillMount() {
    const userId = localStorage.getItem('userId');
    console.log('userId from localStorage', userId);

    this.unsubscribe = this.subscribe(userId);
  }

  subscribe = userId => {
    this.props.allMessageQuery.subscribeToMore({
      document: newMessageSubscription,
      variables: { userId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('prev', prev);
        console.log('subscriptionData', subscriptionData);

        // console.log('subscriptionData', subscriptionData);

        if (!subscriptionData) {
          return prev;
        }

        const message = subscriptionData.data.newMessageAdded;
        // console.log('message.userId', message.userId);
        // const localId = localStorage.getItem('userId');
        // console.log(localId === message.userId);

        // if (message.userId === localStorage.getItem('userId')) {
        //   return prev;
        // }

        // return prev;

        return {
          ...prev,
          allMessages: [message, ...prev.allMessages],
        };
      },
    });
  };

  handleLoadMore = () => {
    const num = this.props.allMessageQuery.allMessages.length;
    console.log('num', num);
    localStorage.setItem('num', num);

    this.props.allMessageQuery.fetchMore({
      variables: {
        skip: num,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        console.log('prev', prev);
        console.log('fetchMoreResult', fetchMoreResult);

        return {
          ...prev,
          allMessages: [...prev.allMessages, ...fetchMoreResult.allMessages],
        };
      },
    });
  };

  render() {
    if (this.props.allMessageQuery.loading) {
      return <div>loading</div>;
    } else {
      console.log('this.props.allMessageQuery.allMessages', this.props.allMessageQuery.allMessages);
      console.log('this.props.allMessageQuery', this.props.allMessageQuery);

      const { allMessages } = this.props.allMessageQuery;
      return [
        <Item.Group divided key="item">
          {allMessages.map(m => {
            return <MessageItem m={m} key={m._id} />;
          })}
        </Item.Group>,
        <Button onClick={this.handleLoadMore} key="button">
          更多
        </Button>,
      ];
    }
  }
}

export const QUERY_ALL_MESSAGES = gql`
  query allMessages($skip: Int!) {
    allMessages(skip: $skip) {
      content
      userId
      createdAt
      _id
      owner
      votes {
        userId
      }
    }
  }
`;

//  _id: String!
//   content: String!
//   createdAt: String!
//   userId: String!
//   owner: String!
//   votes:[Vote!]

// export const QUERY_ALL_MESSAGES = gql`
//   query allMessages {
//     allMessages {
//       content
//       userId
//       createdAt
//       _id
//     }
//   }
// `;

{
  /* <Item>
  <Item.Image size="mini" src={ava} />

  <Item.Content>
    <Item.Header as="a">Watchmen</Item.Header>
    <Item.Meta>
      <span className="cinema">IFC</span>
    </Item.Meta>
    <Item.Description>{paragraph}</Item.Description>
    <Item.Extra />
  </Item.Content>
</Item>; */
}

export default withApollo(
  graphql(QUERY_ALL_MESSAGES, {
    name: 'allMessageQuery',
    options: props => {
      return {
        variables: {
          skip: 0,
        },
      };
    },
  })(MessageContainer)
);
