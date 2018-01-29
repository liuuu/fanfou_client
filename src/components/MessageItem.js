import React, { Component } from 'react';
import { Item, Label, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ava from '../jenny.jpg';

class MessageItem extends Component {
  render() {
    const { m, handleVote, handleRtClick, handleDeleteM } = this.props;
    //check if the user has been voted
    const userId = localStorage.getItem('userId');
    console.log('useId', userId);
    const isVoted = m.votes.findIndex(v => v.userId === userId) > -1;
    const isOwner = m.userId === userId;

    return (
      <Item key={m._id}>
        <Item.Image size="mini" src={m.avatarUrl} />

        <Item.Content>
          <Item.Header>
            <Link to={`/user/${m.userId}`}>@{m.owner}</Link>
          </Item.Header>
          <Item.Meta>
            {/* <span className="cinema">{m.createdAt}</span> */}
            <Link to={`/message/${m._id}`}>
              <TimeAgo date={new Date(m.createdAt).toUTCString()} live={false} />
            </Link>
          </Item.Meta>
          <Item.Description>{m.content}</Item.Description>

          <Item.Extra>
            <Popup
              trigger={
                <Label onClick={(e, data) => handleVote(e, data, isVoted, m)} basic size="mini">
                  <Icon name="heart" color={isVoted ? 'red' : 'grey'} />
                  {m.votes.length}
                </Label>
              }
              size="mini"
              content={isVoted ? '取消' : '点赞'}
              position="top center"
              inverted
            />
            <Label onClick={(e, data) => handleVote(e, data, isVoted, m)} size="mini">
              <Icon name="heart" color={isVoted ? 'red' : 'grey'} />
              {m.votes.length}
            </Label>
            <Label>
              <Icon name="reply" />
              15
            </Label>
            <Label>
              <Icon name="mail outline" />
            </Label>

            <Label basic className="test" onClick={(e, data) => handleRtClick(m)}>
              <Icon name="retweet" />
              15
            </Label>
            {isOwner && (
              <span onClick={() => handleDeleteM(m._id)}>
                <Icon name="delete" fitted color="blue" />
              </span>
            )}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

const LLL = () => {
  return (
    <div>
      <Icon name="retweet" />
      15
    </div>
  );
};

export default MessageItem;
