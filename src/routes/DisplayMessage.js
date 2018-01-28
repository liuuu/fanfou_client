import React, { Component } from 'react';
import { Item, Label, Container, Menu, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import ava from '../jenny.jpg';

import MessageItem from '../components/MessageItem';
import { QUERY_ALL_MESSAGES } from '../components/MessageContainer';

class DisplayMessage extends Component {
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
    if (this.props.queryMessage.loading) {
      return <div>loading</div>;
    }

    console.log(this.props.queryMessage);

    const m = this.props.queryMessage.message;
    console.log('m', m);

    return (
      <Container>
        <Menu pointing secondary size="large">
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/work">Work</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/work">Compony</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/work">Career</Link>
          </Menu.Item>
          <Menu.Item position="right">
            <Button>Log in</Button>
            <Button style={{ marginLeft: '0.5em' }}>Sign Up</Button>
          </Menu.Item>
        </Menu>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'left' }}>
          <MessageItem m={m} handleVote={this.handleVote} />
        </div>
      </Container>
    );
  }
}

const QUERY_SINGLE_MESSAGE = gql`
  query queryMessage($_id: String!) {
    message(_id: $_id) {
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

export default compose(
  graphql(QUERY_SINGLE_MESSAGE, {
    name: 'queryMessage',
    options: props => {
      return {
        variables: {
          _id: props.match.params.messageId,
        },
      };
    },
  }),
  graphql(MUTATE_CREATE_VOTE, { name: 'createVoteMutation' }),
  graphql(MUTATE_REMOVE_VOTE, { name: 'removeVoteMutation' })
)(DisplayMessage);
