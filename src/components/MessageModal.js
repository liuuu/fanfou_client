import React, { Component } from 'react';
import { Modal, Button, Item, Form, TextArea } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ava from '../jenny.jpg';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class MessageModal extends Component {
  state = {
    value: `@${this.props.m.owner}  ${this.props.m.content}`,
    loading: false,
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = async e => {
    // optimistic and fetchmore

    const { value } = this.state;
    this.setState({
      loading: true,
    });

    const result = await this.props.createMessageMutation({
      variables: {
        content: value,
      },
      refetchQueries: [
        {
          query: gql`
            query allMessages($skip: Int!, $userId: String) {
              allMessages(skip: $skip, userId: $userId) {
                content
                userId
                createdAt
                _id
                owner
                votes {
                  userId
                }
                avatarUrl
              }
            }
          `,
          variables: { skip: 0, userId: null },
        },
      ],
    });
    this.setState({
      loading: false,
    });
    this.props.handleClose();
  };
  render() {
    console.log('this.props', this.props);
    console.log('openiiiiiiiiiiiiiii');

    const { open, m } = this.props;

    // return 'sdf';
    return (
      <Modal size="small" open={open} onClose={this.props.handleClose}>
        <Modal.Header>转发微博</Modal.Header>
        <Modal.Content>
          <Item.Content>
            <Form>
              <TextArea
                autoHeight
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="Try adding multiple lines"
              />
            </Form>
          </Item.Content>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="转发"
            onClick={this.handleSubmit}
            loading={this.state.loading}
          />
        </Modal.Actions>
      </Modal>
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
      }
    }
  }
`;

export default graphql(CREATE_MESSAGE, { name: 'createMessageMutation' })(MessageModal);
