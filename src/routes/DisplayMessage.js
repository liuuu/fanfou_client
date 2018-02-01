import React, { Component } from 'react';
import { Item, Label, Icon, Popup, Image, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

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
      return <div className="all-message">loading</div>;
    }

    console.log(this.props.queryMessage);

    const m = this.props.queryMessage.message;
    console.log('m', m);
    const userId = localStorage.getItem('userId');
    console.log('useId', userId);
    const isVoted = m.votes.findIndex(v => v.userId === userId) > -1;
    const isOwner = m.userId === userId;

    return (
      <div className="all-message">
        <Container>
          <Navbar />
          <div style={messageStyle}>
            <ItemLeft>
              <Image src={m.avatarUrl} size="tiny" />
            </ItemLeft>

            <ItemRight>
              <Item.Header>
                <Link to={`/user/${m.userId}`}>@{m.owner}</Link>
              </Item.Header>
              <Item.Meta>
                <Link to={`/message/${m._id}`}>
                  <TimeAgo date={new Date(m.createdAt).toUTCString()} live={false} />
                </Link>
              </Item.Meta>
              <div style={{ paddingTop: '0.5rem' }}>
                <Item.Description>{m.content}</Item.Description>
              </div>
            </ItemRight>
          </div>
        </Container>
      </div>
    );
  }
}

const ItemLeft = styled.div`
  flex: 0 0 80px;
  height: 80px;
  margin-right: 1rem;
`;

const ItemRight = styled.div`
  flex: 1;
`;

const messageStyle = {
  background: '#acdae5',
  padding: ' 1rem',
  maxWidth: '768px',
  margin: '4rem auto',
  textAlign: 'left',
  borderRadius: '1rem',
  // border: '1px solid red',
  display: 'flex',
};

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
      avatarUrl
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
      avatarUrl
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
      avatarUrl
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
