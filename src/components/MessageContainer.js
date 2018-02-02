import React, { Component } from 'react';
import { Item, Label, Button, Divider, Loader, Segment } from 'semantic-ui-react';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';
import MessageItem from './MessageItem';

class MessageContainer extends Component {
  notiCounts = 0;
  state = {
    open: false,
    loadingMore: false,
    hasMore: true,
  };

  handleLoadMore = async () => {
    this.setState({
      loadingMore: true,
    });

    const num = this.props.allMessageQuery.allMessages.length + this.notiCounts;

    const userId = this.props.match.params.userId || null;
    const result = await this.props.allMessageQuery.fetchMore({
      variables: {
        skip: num,
        userId: userId,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          ...prev,
          allMessages: [...prev.allMessages, ...fetchMoreResult.allMessages],
        };
      },
    });

    if (result.data.allMessages.length === 0) {
      this.setState({
        loadingMore: false,
        hasMore: false,
      });
    } else {
      this.setState({
        loadingMore: false,
        hasMore: true,
      });
    }
  };

  handleVote = (e, data, isVoted, m) => {
    // console.log('data', data, isVoted);
  };

  render() {
    console.log('rendering all');

    if (this.props.allMessageQuery.loading) {
      return (
        <div>
          <div style={{ marginTop: '20rem' }}>
            <Loader size="large" active as="div">
              loading
            </Loader>
          </div>
        </div>
      );
    } else {
      const { allMessages } = this.props.allMessageQuery;
      const open = this.state.open;
      return [
        <Item.Group divided key="item">
          {allMessages.map(m => {
            return (
              <MessageItem
                m={m}
                key={m._id}
                handleVote={this.handleVote}
                handleRtClick={this.handleRtClick}
                handleDeleteM={this.handleDeleteM}
              />
            );
          })}
        </Item.Group>,

        <Button onClick={this.handleLoadMore} loading={this.state.loadingMore} key="button">
          {this.state.hasMore ? '加载更多' : '没有更多了'}
        </Button>,
      ];
    }
  }
}

export const QUERY_ALL_MESSAGES = gql`
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
`;

const withData = graphql(QUERY_ALL_MESSAGES, {
  name: 'allMessageQuery',
  options: props => {
    const userId = props.match.params.userId || null;

    return {
      variables: {
        skip: 0,
        userId: userId,
      },
      fetchPolicy: 'network-only',
    };
  },
});

export default withRouter(compose(withData)(MessageContainer));
