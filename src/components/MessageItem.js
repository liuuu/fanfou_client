import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Item, Label, Icon, Popup, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ava from '../jenny.jpg';
import { QUERY_ALL_MESSAGES } from './MessageContainer';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

class MessageItem extends React.PureComponent {
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('this.props', this.props);
  //   console.log('nextProps', nextProps);
  //   console.log(nextProps.m.votes.length === this.props.m.votes.length);

  //   if (nextProps.m.votes.length === this.props.m.votes.length) {
  //     return false;
  //   }
  //   return true;
  // }

  componentWillUpdate(nextProps) {
    // console.log('this.props', this.props);
    // console.log('nextProps', nextProps);
    if (this.props.m.votes.length === nextProps.m.votes.length) {
      return false;
    }
    const a = nextProps === this.props;
    console.log(a);
  }

  handleVote = (e, data, isVoted, m) => {
    // console.log('data', data, isVoted);
    console.log('inding---------------------------');

    const userId = localStorage.getItem('userId');
    const paramUserId = this.props.match.params.userId || null;

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
            variables: { skip: 0, userId: paramUserId },
          });
          console.log('data from previous store by createVote', data);
          const idx = data.allMessages.findIndex(m => m._id === createVote._id);
          console.log('data', data);
          console.log('data.allMessages[idx]', data.allMessages[idx]);

          data.allMessages[idx].votes = createVote.votes;

          console.log('data', data);

          proxy.writeQuery({
            query: QUERY_ALL_MESSAGES,
            variables: { skip: 0, userId: paramUserId },
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
            variables: { skip: 0, userId: paramUserId },
          });
          console.log('enter?');
          console.log('createVote', removeVote);

          const idx = data.allMessages.findIndex(m => m._id === removeVote._id);

          data.allMessages[idx].votes = removeVote.votes;

          proxy.writeQuery({
            query: QUERY_ALL_MESSAGES,
            variables: { skip: 0, userId: paramUserId },
            data,
          });
        },
        refetchQueries: refetchQueries,
      });
    }
  };
  render() {
    const { m, handleVote, handleRtClick, handleDeleteM } = this.props;
    //check if the user has been voted
    const userId = localStorage.getItem('userId');
    console.log('useId', userId);
    const isVoted = m.votes.findIndex(v => v.userId === userId) > -1;
    const isOwner = m.userId === userId;
    console.log('singgel-----------------');
    return (
      <Item key={m._id}>
        <Item.Image src={m.avatarUrl} className="item-image" size="mini" />

        <Item.Content>
          <Item.Header>
            <Link to={`/user/${m.userId}`}>@{m.owner}</Link>
          </Item.Header>
          <Item.Meta>
            <Link to={`/message/${m._id}`}>
              <TimeAgo date={new Date(m.createdAt).toUTCString()} live={false} />
            </Link>
          </Item.Meta>
          <Item.Description>{m.content}</Item.Description>

          <Item.Extra>
            <Popup
              trigger={
                <Label onClick={(e, data) => handleVote(e, data, isVoted, m)} size="tiny">
                  <Icon name="heart" color={isVoted ? 'red' : 'grey'} />
                  {m.votes.length}
                </Label>
              }
              size="mini"
              content={isVoted ? '取消' : '喜欢'}
              position="top center"
              inverted
            />
            <Popup
              trigger={
                <Label
                  onClick={(e, data) => handleRtClick(e, data, m)}
                  size="tiny"
                  className="test"
                >
                  <Icon name="retweet" />
                </Label>
              }
              size="mini"
              content={'转发'}
              position="top center"
              inverted
            />
            {/* <Label onClick={(e, data) => handleVote(e, data, isVoted, m)} size="mini">
              <Icon name="heart" color={isVoted ? 'red' : 'grey'} />
              {m.votes.length}
            </Label> */}
            {/* <Label>
              <Icon name="reply" />
              15
            </Label>
            <Label>
              <Icon name="mail outline" />
            </Label> */}

            {isOwner && (
              <Popup
                trigger={
                  <span className="delete-icon">
                    <Icon name="delete" fitted />
                  </span>
                }
                content={
                  <Button
                    size="mini"
                    color="red"
                    onClick={() => handleDeleteM(m._id)}
                    style={buttonStyle}
                  >
                    删除
                  </Button>
                }
                hideOnScroll
                size="mini"
                on="click"
                position="top center"
                style={popupStyle}
                inverted
              />
            )}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

const popupStyle = {
  opacity: 1,
  padding: '0.35rem',
  background: 'rgba(0, 0, 0, 1)',
};

const buttonStyle = {
  background: 'red',
  border: 'none',
  // display: 'flex',
  // justifyContent: 'center',
  // alignItems: 'center',
  padding: '0.1rem, 0.2rem',
  margin: 0,
  color: 'white',
};

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

const withCreateVoteMutation = graphql(MUTATE_CREATE_VOTE, { name: 'createVoteMutation' });

const withRemoveVoteMutation = graphql(MUTATE_REMOVE_VOTE, { name: 'removeVoteMutation' });
// export default compose(withCreateVoteMutation, withRemoveVoteMutation)(withRouter(MessageItem));
export default MessageItem;
