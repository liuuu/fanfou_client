import React, { Component } from 'react';
import { Form, TextArea, Button, Progress } from 'semantic-ui-react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { QUERY_ALL_MESSAGES } from './MessageContainer';
import Divider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider';

class CreateMessageForm extends Component {
  state = { value: '', percent: 0 };

  handleChange = e => {
    if (e.target.value.length > 160) {
      this.setState({
        value: e.target.value.slice(0, 160),
        percent: e.target.value.trim().length * 100 / 160,
      });
      return;
    }
    this.setState({
      value: e.target.value.trim(),
      percent: e.target.value.trim().length * 100 / 160,
    });
  };

  handleSubmit = e => {
    // optimistic and fetchmore
    // console.log('this.props', this.props);
    const userId = this.props.match.params.userId ? this.props.match.params.userId : null;
    const { value } = this.state;
    if (!this.state.value) {
      return;
    }

    // not work cause the readQuery only require the `root` query as the skip:6 intererting

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
            owner: localStorage.getItem('name'),
            avatarUrl: localStorage.getItem('avatarUrl'),
          },
        },
      },
      update: (proxy, { data: { createMessage } }) => {
        console.log('proxy', proxy);

        const readData = proxy.readQuery({
          query: QUERY_ALL_MESSAGES,
          variables: { skip: 0, userId: userId },
        });

        console.log('readData', readData);
        console.log('readData.allMessages', readData.allMessages);
        console.log('createMessage', createMessage);

        readData.allMessages.unshift(createMessage.message);

        // console.log('readData', readData);
        console.log('-----------------------');

        proxy.writeQuery({
          query: QUERY_ALL_MESSAGES,
          variables: { skip: 0, userId: userId },
          data: readData,
        });
      },
      refetchQueries: refetchQueries,
    });
    this.setState({
      value: '',
      percent: 0,
    });
  };
  render() {
    // console.log('this.state.percent', this.state.percent);

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
        <Divider clearing fitted hidden />
        <div>
          <Form.Field control={Button} className="form-button">
            发送
          </Form.Field>
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

export default withRouter(
  withApollo(graphql(CREATE_MESSAGE, { name: 'createMessageMutation' })(CreateMessageForm))
);
