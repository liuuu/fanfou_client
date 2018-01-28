import React, { Component } from 'react';
import { Item, Label, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ava from '../jenny.jpg';

class MessageItem extends Component {
  handleHover = e => {
    console.log('onHover');

    e.target.style.color = 'red';
  };
  render() {
    const { m, handleVote } = this.props;
    //check if the user has been voted
    const userId = localStorage.getItem('userId');
    console.log('useId', userId);
    const isVoted = m.votes.findIndex(v => v.userId === userId) > -1;

    return (
      <Item key={m._id}>
        <Item.Image size="mini" src={ava} />

        <Item.Content>
          <Item.Header as="a">{m.userId}</Item.Header>
          <Item.Meta>
            {/* <span className="cinema">{m.createdAt}</span> */}
            <Link to={`/message/${m._id}`}>
              <TimeAgo date={new Date(m.createdAt).toUTCString()} live={false} />
            </Link>
          </Item.Meta>
          <Item.Description>{m.content}</Item.Description>
          <Item.Extra>
            <Label onClick={(e, data) => handleVote(e, data, isVoted, m)}>
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

            <Label basic className="test">
              <Icon name="retweet" />
              15
            </Label>
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
