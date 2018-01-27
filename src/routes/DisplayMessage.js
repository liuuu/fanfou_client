import React, { Component } from 'react';
import { Item, Label, Container, Menu, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ava from '../jenny.jpg';

class DisplayMessage extends Component {
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
                <Label>IMAX</Label>
                <Label icon="globe" content="Additional Languages" />
              </Item.Extra>
            </Item.Content>
          </Item>
        </div>
      </Container>
    );
  }
}

const QUERY_SINGLE_MESSAGE = gql`
  query queryMessage($id: String!) {
    message(id: $id) {
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

export default graphql(QUERY_SINGLE_MESSAGE, {
  name: 'queryMessage',
  options: props => {
    return {
      variables: {
        id: props.match.params.messageId,
      },
    };
  },
})(DisplayMessage);
