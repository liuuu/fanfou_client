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
    const { m } = this.props;
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
            <Label>
              <Icon name="heart" color="" />
              15
            </Label>
            <Label>
              <Icon name="reply" color="" />
              15
            </Label>
            <Label>
              <Icon name="mail outline" color="" />
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
