import React, { Component } from 'react';
import { Item, Label, Button, Divider, Loader, Segment } from 'semantic-ui-react';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';
import MessageItem from './MessageItem';

class MessageContainer extends Component {
  notiCounts = 0;
  state = {
    open: false,
    loadingMore: false,
    hasMore: true,
  };

  handleLoadMore = async () => {
    this.setState({
      loadingMore: true,
    });

    const num = this.props.allMessageQuery.allMessages.length + this.notiCounts;

    const userId = this.props.match.params.userId || null;
    const result = await this.props.allMessageQuery.fetchMore({
      variables: {
        skip: num,
        userId: userId,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          // ...prev,
          allMessages: [...prev.allMessages, ...fetchMoreResult.allMessages],
        };
      },
    });

    if (result.data.allMessages.length === 0) {
      this.setState({
        loadingMore: false,
        hasMore: false,
      });
    } else {
      this.setState({
        loadingMore: false,
        hasMore: true,
      });
    }
  };

  handleVote = (e, data, isVoted, m) => {
    // console.log('data', data, isVoted);
    const userId = this.props.match.params.userId ? this.props.match.params.userId : null;
    console.log('userId-----------', userId);

    if (!isVoted) {
      this.props.createVoteMutation({
        variables: {
          _id: m._id,
          userId: userId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createVote: {
            __typename: 'Message',
            content: m.content,
            userId: m.userId,
            createdAt: m.createdAt,
            _id: m._id,
            owner: m.owner,
            avatarUrl: m.avatarUrl,
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
          const data = proxy.readQuery({
            query: QUERY_ALL_MESSAGES,
            variables: { skip: 0, userId: userId },
          });
          console.log('data from previous store by createVote', data);
          const idx = data.allMessages.findIndex(m => m._id === createVote._id);
          console.log('data', data);
          console.log('data.allMessages[idx]', data.allMessages[idx]);

          data.allMessages[idx].votes = createVote.votes;

          console.log('data', data);

          proxy.writeQuery({
            query: QUERY_ALL_MESSAGES,
            variables: { skip: 0, userId: userId },
            data,
          });
        },
        // refetchQueries: refetchQueries,
      });
    } else {
      // alresdy voted and find to remove
      console.log('ss');

      const idx = m.votes.findIndex(m => m.userId === userId);
      const opsVotes = m.votes.slice().splice(idx, 1);
      this.props.removeVoteMutation({
        variables: {
          _id: m._id,
          userId: userId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeVote: {
            __typename: 'Message',
            content: m.content,
            userId: m.userId,
            createdAt: m.createdAt,
            _id: m._id,
            owner: m.owner,
            votes: [...opsVotes],
            avatarUrl: m.avatarUrl,
          },
        },
        update: (proxy, { data: { removeVote } }) => {
          const data = proxy.readQuery({
            query: QUERY_ALL_MESSAGES,
            variables: { skip: 0, userId: userId },
          });
          console.log('enter?');
          console.log('createVote', removeVote);

          const idx = data.allMessages.findIndex(m => m._id === removeVote._id);

          data.allMessages[idx].votes = removeVote.votes;

          proxy.writeQuery({
            query: QUERY_ALL_MESSAGES,
            variables: { skip: 0, userId: userId },
            data,
          });
        },
        // refetchQueries: refetchQueries,
      });
    }
  };

  render() {
    console.log('rendering all');

    if (this.props.allMessageQuery.loading) {
      return (
        <div>
          <div style={{ marginTop: '20rem' }}>
            <Loader size="large" active as="div">
              loading
            </Loader>
          </div>
        </div>
      );
    } else {
      const { allMessages } = this.props.allMessageQuery;
      const open = this.state.open;
      return [
        <Item.Group divided key="item">
          {allMessages.map(m => {
            return (
              <MessageItem
                m={m}
                key={m._id}
                handleVote={this.handleVote}
                handleRtClick={this.handleRtClick}
                handleDeleteM={this.handleDeleteM}
              />
            );
          })}
        </Item.Group>,

        <Button onClick={this.handleLoadMore} loading={this.state.loadingMore} key="button">
          {this.state.hasMore ? '加载更多' : '没有更多了'}
        </Button>,
      ];
    }
  }
}

export const QUERY_ALL_MESSAGES = gql`
  query allMessages($skip: Int!, $userId: String) {
    allMessages(skip: $skip, userId: $userId) {
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

const withData = graphql(QUERY_ALL_MESSAGES, {
  name: 'allMessageQuery',
  options: props => {
    const userId = props.match.params.userId || null;

    return {
      variables: {
        skip: 0,
        userId: userId,
      },
      fetchPolicy: 'network-only',
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

const MUTATE_DELETE_MESSAGE = gql`
  mutation removeMessage($_id: String!) {
    removeMessage(_id: $_id) {
      ok
      error
      message {
        _id
        content
        createdAt
        userId
        owner
        votes {
          userId
        }
        avatarUrl
      }
    }
  }
`;

const withCreateVoteMutation = graphql(MUTATE_CREATE_VOTE, { name: 'createVoteMutation' });
const withRemoveVoteMutation = graphql(MUTATE_REMOVE_VOTE, { name: 'removeVoteMutation' });
const withRomoveMessageMutation = graphql(MUTATE_DELETE_MESSAGE, { name: 'removeMessageMutation' });

export default withRouter(
  compose(withData, withRemoveVoteMutation, withCreateVoteMutation, withRomoveMessageMutation)(
    MessageContainer
  )
);
