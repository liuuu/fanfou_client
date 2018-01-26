import React, { Component } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { QUERY_ALL_MESSAGES } from './MessageContainer';

class CreateMessageForm extends Component {
  state = { value: '' };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = e => {
    // optimistic and fetchmore
    console.log('this.props', this.props);
    // this.props.mutate();
    const { value } = this.state;

    const result = this.props.createMessageMutation({
      variables: {
        content: value,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: '__MessageResponse',
          ok: true,
          error: null,
          message: {
            __typename: 'Message',
            _id: '-1',
            userId: '39949359934',
            content: value,
            createdAt: +new Date(),
          },
        },
      },
      update: (proxy, { data: { createMessage } }) => {
        console.log('form update', data);

        const data = proxy.readQuery({ query: QUERY_ALL_MESSAGES });

        data.allMessages.unshift(createMessage.message);

        proxy.writeQuery({ query: QUERY_ALL_MESSAGES, data });
      },
    });
    console.log('result', result);
  };
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field
          control={TextArea}
          label="你在做什么"
          placeholder="Tell us more about you..."
          value={this.state.value}
          onChange={this.handleChange}
        />

        <Form.Field control={Button}>Submit</Form.Field>
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
      }
    }
  }
`;

export default graphql(CREATE_MESSAGE, { name: 'createMessageMutation' })(CreateMessageForm);
