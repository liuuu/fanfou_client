import React, { Component } from 'react';
import { Form, TextArea, Button, Progress } from 'semantic-ui-react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { QUERY_ALL_MESSAGES } from './MessageContainer';

class CreateMessageForm extends Component {
  state = { value: '', percent: 0 };

  handleChange = e => {
    if (e.target.value.length > 20) {
      this.setState({
        value: e.target.value.slice(0, 20),
        percent: e.target.value.trim().length * 100 / 20,
      });
      return;
    }
    this.setState({
      value: e.target.value.trim(),
      percent: e.target.value.trim().length * 100 / 20,
    });
  };

  handleSubmit = e => {
    // optimistic and fetchmore
    console.log('this.props', this.props);
    if (!this.state.value) {
      return;
    }

    const { value } = this.state;

    // not work cause the readQuery only require the root query as the skip:0 intererting
    const num = parseInt(localStorage.getItem('num'), 10) || 0;

    const result = this.props.createMessageMutation({
      variables: {
        content: value,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'MessageResponse',
          ok: true,
          error: null,
          message: {
            __typename: 'Message',
            _id: +new Date(),
            userId: 'faked id',
            content: value,
            createdAt: +new Date(),
            votes: [],
            owner: 'fsf',
            avatarUrl: localStorage.getItem('avatarUrl'),
          },
        },
      },
      update: (proxy, { data: { createMessage } }) => {
        console.log('proxy', proxy);

        const readData = proxy.readQuery({ query: QUERY_ALL_MESSAGES, variables: { skip: 0 } });
        // {
        //   allMessage:[]
        // }

        console.log('readData', readData);
        console.log('readData.length', readData.allMessages.length);
        console.log('readData.allMessages', readData.allMessages);
        console.log('readData.allMessages', readData.allMessages[0]);

        console.log('createMessage', createMessage);

        readData.allMessages.unshift(createMessage.message);

        // console.log('readData', readData);

        proxy.writeQuery({ query: QUERY_ALL_MESSAGES, variables: { skip: 0 }, data: readData });
      },
    });
    // console.log('result', result);
  };
  render() {
    console.log('this.state.percent', this.state.percent);

    return (
      <Form onSubmit={this.handleSubmit}>
        <div>
          <Form.Field
            control={TextArea}
            label="你在做什么"
            placeholder="Tell us more about you..."
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <Progress percent={this.state.percent} attached="bottom" />
        <div>
          <Form.Field control={Button}>Submit</Form.Field>
        </div>
      </Form>
    );
  }
}

const CREATE_MESSAGE = gql`
  mutation createMessageMutation($content: String!) {
    createMessage(content: $content) {
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

export default withApollo(
  graphql(CREATE_MESSAGE, { name: 'createMessageMutation' })(CreateMessageForm)
);
