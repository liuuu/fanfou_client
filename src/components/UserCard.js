import React, { Component } from 'react';
import { Card, Image, Button, Divider } from 'semantic-ui-react';
import ava from '../jenny.jpg';

import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

class UserCard extends Component {
  render() {
    if (this.props.queryUser.loading) {
      return <div>loading</div>;
    }

    const user = this.props.queryUser.user;
    return (
      <div>
        <Card>
          <Card.Content>
            <Image size="tiny" src={user.avatarUrl} />
            <Divider />
            <Card.Header>{`@${user.name}`}</Card.Header>
            <Card.Meta>我是一个粉刷匠, 粉刷本领强</Card.Meta>
            <Card.Description />
          </Card.Content>
          <Card.Content extra>
            <Button.Group>
              <Button compact>
                <div>粉丝:</div>
                <div>{user.followers.length}</div>
              </Button>
              <Button compact>
                <div>关注:</div>
                <div>{user.followings.length}</div>
              </Button>
              <Button compact>
                <div>微博:</div>
                <div>{user.messageCount}</div>
              </Button>
            </Button.Group>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

const QUERY_USER = gql`
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
    }
  }
`;

export default graphql(QUERY_USER, {
  name: 'queryUser',
  options: props => {
    const userId = (props.match && props.match.params.userId) || localStorage.getItem('userId');
    return {
      variables: {
        id: userId,
      },
    };
  },
})(UserCard);
