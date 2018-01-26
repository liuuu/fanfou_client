import React, { Component } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import ava from '../jenny.jpg';

const paragraph = 'lorem sjdklf sadljkf';

class MessageContainer extends Component {
  render() {
    if (this.props.allMessageQuery.loading) {
      return <div>loading</div>;
    } else {
      console.log('this.props.allMessageQuery.allMessages', this.props.allMessageQuery.allMessages);
      const { allMessages } = this.props.allMessageQuery;
      return (
        <Item.Group divided>
          {allMessages.map(m => {
            return (
              <Item key={m._id}>
                <Item.Image size="mini" src={ava} />

                <Item.Content>
                  <Item.Header as="a">{m.userId}</Item.Header>
                  <Item.Meta>
                    <span className="cinema">{m.createdAt}</span>
                  </Item.Meta>
                  <Item.Description>{m.content}</Item.Description>
                  <Item.Extra>
                    <Label>IMAX</Label>
                    <Label icon="globe" content="Additional Languages" />
                  </Item.Extra>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
      );
    }
  }
}

export const QUERY_ALL_MESSAGES = gql`
  query allMessages {
    allMessages {
      content
      userId
      createdAt
      _id
    }
  }
`;

{
  /* <Item>
  <Item.Image size="mini" src={ava} />

  <Item.Content>
    <Item.Header as="a">Watchmen</Item.Header>
    <Item.Meta>
      <span className="cinema">IFC</span>
    </Item.Meta>
    <Item.Description>{paragraph}</Item.Description>
    <Item.Extra />
  </Item.Content>
</Item>; */
}

export default graphql(QUERY_ALL_MESSAGES, { name: 'allMessageQuery' })(MessageContainer);
