import React, { Component } from 'react';
import { Item, Label, Button } from 'semantic-ui-react';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import MessageItem from './MessageItem';

import ava from '../jenny.jpg';
import CommentGroup from 'semantic-ui-react/dist/commonjs/views/Comment/CommentGroup';

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
    console.log('this.props in will Mount', this.props);

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

  handleVote = (e, data, isVoted, m) => {
    // console.log('data', data, isVoted);

    const userId = localStorage.getItem('userId');
    if (!isVoted) {
      this.props.createVoteMutation({
        variables: {
          _id: m._id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createVote: {
            __typename: 'Message',
            content: m.content,
            userId: userId,
            createdAt: m.createdAt,
            _id: m._id,
            owner: m.owner,
            votes: [
              ...m.votes,
              {
                __typename: 'Vote',
                userId: userId,
              },
            ],
          },
        },
        update: (proxy, { data: { createVote } }) => {
          console.log('proxy', proxy);
          // optimistic data already write in the memory store??
          const data = proxy.readQuery({ query: QUERY_ALL_MESSAGES, variables: { skip: 0 } });
          console.log('data from previous store by createVote', data);
          const idx = data.allMessages.findIndex(m => m._id === createVote._id);
          console.log('data', data);
          console.log('data.allMessages[idx]', data.allMessages[idx]);

          data.allMessages[idx].votes = createVote.votes;

          console.log('data', data);

          proxy.writeQuery({ query: QUERY_ALL_MESSAGES, variables: { skip: 0 }, data });
        },
      });
    } else {
      // alresdy voted and find to remove
      console.log('ss');

      const idx = m.votes.findIndex(m => m.userId === userId);
      const opsVotes = m.votes.slice().splice(idx, 1);
      this.props.removeVoteMutation({
        variables: {
          _id: m._id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeVote: {
            __typename: 'Message',
            content: m.content,
            userId: userId,
            createdAt: m.createdAt,
            _id: m._id,
            owner: m.owner,
            votes: [...opsVotes],
          },
        },
        update: (proxy, { data: { removeVote } }) => {
          const data = proxy.readQuery({ query: QUERY_ALL_MESSAGES, variables: { skip: 0 } });
          console.log('enter?');
          console.log('createVote', removeVote);

          const idx = data.allMessages.findIndex(m => m._id === removeVote._id);

          data.allMessages[idx].votes = removeVote.votes;

          proxy.writeQuery({ query: QUERY_ALL_MESSAGES, variables: { skip: 0 }, data });
        },
      });
    }
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
            return <MessageItem m={m} key={m._id} handleVote={this.handleVote} />;
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

const withData = graphql(QUERY_ALL_MESSAGES, {
  name: 'allMessageQuery',
  options: props => {
    return {
      variables: {
        skip: 0,
      },
    };
  },
});

const MUTATE_CREATE_VOTE = gql`
  mutation createVote($_id: String!) {
    createVote(_id: $_id) {
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
const MUTATE_REMOVE_VOTE = gql`
  mutation removeVote($_id: String!) {
    removeVote(_id: $_id) {
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

const withCreateVoteMutation = graphql(MUTATE_CREATE_VOTE, { name: 'createVoteMutation' });
const withRemoveVoteMutation = graphql(MUTATE_REMOVE_VOTE, { name: 'removeVoteMutation' });

export default compose(withData, withRemoveVoteMutation, withCreateVoteMutation)(MessageContainer);
