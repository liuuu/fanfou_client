import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Item, Label, Icon, Popup, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ava from '../jenny.jpg';
import { warnOnceInDevelopment } from 'apollo-utilities';

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
                  <Button size="mini" color="red" onClick={() => handleDeleteM(m._id)}>
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
};

const buttonStyle = {
  background: 'red',
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItem: 'center',
  color: 'white',
};

const LLL = () => {
  return (
    <div>
      <Icon name="retweet" />
      15
    </div>
  );
};

export default MessageItem;
