import React, { Component } from 'react';
import { Item, Label, Button, Divider, Loader, Segment, Header } from 'semantic-ui-react';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import TimeAgo from 'react-timeago';
import { Link, withRouter } from 'react-router-dom';
import MessageItem from './MessageItem';
import NotificationBar from './NotificationBar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ava from '../jenny.jpg';
import MessageModal from '../components/MessageModal';
import CreateMessageForm from './CreateMessageForm';

const paragraph = 'lorem sjdklf sadljkf';

// const newMessageSubscription = gql`
//   subscription($userId: String!) {
//     newMessageAdded(userId: $userId) {
//       content
//       userId
//       createdAt
//       _id
//       votes {
//         userId
//       }
//       owner
//       avatarUrl
//     }
//   }
// `;

class MessageContainer extends Component {
  notiCounts = 0;
  state = {
    open: false,
    loadingMore: false,
    hasMore: true,
  };
  // componentWillMount() {
  //   const userId = localStorage.getItem('userId');
  //   console.log('userId from localStorage', userId);
  //   console.log('this.props in will Mount', this.props);

  //   this.unsubscribe = this.subscribe(userId);
  // }

  // subscribe = userId => {
  //   this.props.allMessageQuery.subscribeToMore({
  //     document: newMessageSubscription,
  //     variables: { userId },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       console.log('prev', prev);
  //       console.log('subscriptionData', subscriptionData);

  //       // console.log('subscriptionData', subscriptionData);

  //       if (!subscriptionData) {
  //         return prev;
  //       }

  //       const message = subscriptionData.data.newMessageAdded;
  //       // console.log('message.userId', message.userId);
  //       // const localId = localStorage.getItem('userId');
  //       // console.log(localId === message.userId);

  //       // if (message.userId === localStorage.getItem('userId')) {
  //       //   return prev;
  //       // }

  //       // return prev;

  //       return {
  //         ...prev,
  //         allMessages: [message, ...prev.allMessages],
  //       };
  //     },
  //   });
  // };

  handleLoadMore = async () => {
    // 因为之前的的
    this.setState({
      loadingMore: true,
    });

    const num = this.props.allMessageQuery.allMessages.length + this.notiCounts;
    console.log('num', num);
    // localStorage.setItem('num', num);
    const userId = this.props.match.params.userId ? this.props.match.params.userId : null;
    const result = await this.props.allMessageQuery.fetchMore({
      variables: {
        skip: num,
        userId: userId,
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
    console.log('result', result);
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
          console.log('proxy', proxy);
          // optimistic data already write in the memory store??
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
        refetchQueries: refetchQueries,
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
        refetchQueries: refetchQueries,
      });
    }
  };

  handleRtClick = (e, data, m) => {
    // console.log('modalContent', modalContent);
    console.log('this', this);

    console.log('this.state.open', this.state.open);

    this.setState(prevState => ({
      open: true,
      m,
    }));
  };

  handleClose = e => {
    console.log('e', e);
    // e.target.className retweet icon
    // e.target.className ui tiny label test
    // console.log('e.target.className', e.target.className);

    if (e && (e.target.className.includes('retweet') || e.target.className.includes('label'))) {
      return;
    }

    console.log('closinginging');

    this.setState({
      open: false,
    });
  };

  handleDeleteM = _id => {
    const userId = this.props.match.params.userId ? this.props.match.params.userId : null;

    this.props.removeMessageMutation({
      variables: {
        _id: _id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        removeMessage: {
          __typename: 'MessageResponse',
          ok: true,
          error: null,
          message: {
            __typename: 'Message',
            _id: _id,
            userId: 'faked id',
            content: '我是一个粉刷匠',
            createdAt: +new Date(),
            votes: [],
            owner: 'fsf',
            avatarUrl: localStorage.getItem('avatarUrl'),
          },
        },
      },
      update: (proxy, { data: { removeMessage } }) => {
        console.log('proxy', proxy);

        const readData = proxy.readQuery({
          query: QUERY_ALL_MESSAGES,
          variables: { skip: 0, userId: userId },
        });

        console.log('removeMessage', removeMessage);
        const idx = readData.allMessages.findIndex(m => m._id === _id);

        readData.allMessages.splice(idx, 1);

        // console.log('readData', readData);

        proxy.writeQuery({
          query: QUERY_ALL_MESSAGES,
          variables: { skip: 0, userId: userId },
          data: readData,
        });
      },
      refetchQueries: refetchQueries,
    });
  };

  saveCounts = num => {
    this.notiCounts = num;
  };

  render() {
    console.log('rendering alls');

    if (this.props.allMessageQuery.loading) {
      return (
        <div>
          <div>
            {!(this.props.match && this.props.match.params.userId) && (
              <CreateMessageForm key="create-form" />
            )}
          </div>
          <div style={{ marginTop: '20rem' }}>
            <Loader size="large" active as="div">
              正在加载
            </Loader>
          </div>
        </div>
      );
    } else {
      const { allMessages } = this.props.allMessageQuery;
      const open = this.state.open;
      return [
        !this.props.match.params.userId && <CreateMessageForm key="create-form" />,
        this.props.match.params.userId && (
          <Header as="h2" key="noti">
            他/她的weibo
          </Header>
        ),

        !this.props.match.params.userId && (
          <NotificationBar
            key="noti"
            allMessageQuery={this.props.allMessageQuery}
            ref={node => (this.notibar = node)}
            saveCounts={this.saveCounts}
          />
        ),

        <Item.Group divided key="item">
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
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
          </ReactCSSTransitionGroup>
        </Item.Group>,

        <Button onClick={this.handleLoadMore} loading={this.state.loadingMore} key="button">
          {this.state.hasMore ? '加载更多' : '没有更多了'}
        </Button>,
        open && (
          <MessageModal
            key="modal"
            open={this.state.open}
            handleClose={this.handleClose}
            m={this.state.m}
          />
        ),
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

const refetchQueries = [
  {
    query: gql`
      query userQuery($id: String) {
        user(id: $id) {
          _id
          name
          email
          token
          num
          followers {
            _id
          }
          followings {
            _id
          }
          hisMessages {
            _id
          }
          messageCount
          avatarUrl
          likedMessagesCount
        }
      }
    `,
    variables: { id: localStorage.getItem('userId') },
  },
];

const withData = graphql(QUERY_ALL_MESSAGES, {
  name: 'allMessageQuery',
  options: props => {
    const userId = props.match.params.userId || null;

    return {
      variables: {
        skip: 0,
        userId: userId,
      },
      //  this can be commented to make the the address back and forth not fetch data
      // or probably can operate the another readQuery as well
      fetchPolicy: 'network-only',
    };
  },
});

const withCreateVoteMutation = graphql(MUTATE_CREATE_VOTE, { name: 'createVoteMutation' });
const withRemoveVoteMutation = graphql(MUTATE_REMOVE_VOTE, { name: 'removeVoteMutation' });
const withRomoveMessageMutation = graphql(MUTATE_DELETE_MESSAGE, { name: 'removeMessageMutation' });

export default withRouter(
  compose(withData, withRemoveVoteMutation, withCreateVoteMutation, withRomoveMessageMutation)(
    MessageContainer
  )
);
