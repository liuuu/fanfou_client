import React, { Component } from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
import { Button } from 'semantic-ui-react';
import gql from 'graphql-tag';

const newMessageSubscription = gql`
  subscription($userId: String!) {
    newMessageAdded(userId: $userId) {
      content
      userId
      createdAt
      _id
      votes {
        userId
      }
      owner
      avatarUrl
    }
  }
`;

class NotificationBar extends Component {
  state = {
    open: false,
    content: 0,
    notiMessageArr: [],
  };
  componentWillMount() {
    const userId = localStorage.getItem('userId');
    if (userId) this.unsubscribe = this.subscribe(userId);
  }

  subscribe = userId => {
    this.props.allMessageQuery.subscribeToMore({
      document: newMessageSubscription,
      variables: { userId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('prev', prev);
        console.log('subscriptionData', subscriptionData);

        // console.log('subscriptionData', subscriptionData);

        if (!subscriptionData) {
          return prev;
        }

        // this.count++;
        // console.log('count', this.count);

        // const notiMessageArr = [];
        let message = subscriptionData.data.newMessageAdded;

        console.log(message);

        this.props.saveCounts(this.state.content + 1);
        this.setState({
          open: true,
          content: this.state.content + 1,
          notiMessageArr: [message, ...this.state.notiMessageArr],
        });

        return;

        // return {
        //   ...prev,
        //   allMessages: [message, ...prev.allMessages],
        // };
      },
    });
  };

  handleClick = () => {
    const cache = this.props.client.cache;

    /*
    const data = cache.readQuery({
      query: QUERY_ALL_MESSAGES,
      variables: { skip: 6 },
    });
    console.log('data', data);
    
    data.allMessages.unshift(...this.state.notiMessageArr);
    
    console.log('-----data', data);

    // const newCacheData = [...this.state.notiMessageArr, ...data.allMessages];
    // console.log('newCacheData', newCacheData);

    cache.writeQuery({
      query: QUERY_ALL_MESSAGES,
      variables: { skip: 6 },
      data: data,
    });

    const a = cache.readQuery({
      query: QUERY_ALL_MESSAGES,
      variables: { skip: 6 },
    });

    console.log('a', a);

    this.setState({
      content: 6,
      open: false,
    });
    */

    this.props.saveCounts(0);

    const data = this.props.client.readQuery({
      query: QUERY_ALL_MESSAGES,
      variables: { skip: 0, userId: null },
    });
    console.log('data', data);

    data.allMessages.unshift(...this.state.notiMessageArr);
    this.props.client.writeQuery({
      query: QUERY_ALL_MESSAGES,
      variables: { skip: 0, userId: null },
      data: data,
    });
    this.setState({
      content: 0,
      open: false,
      notiMessageArr: [],
    });

    // this.props.client.refetchQuery({

    // })
  };

  render() {
    console.log('this.state.', this.state.notiMessageArr);

    return (
      <div style={{}} className="noti-button">
        {this.state.open && (
          <Button onClick={this.handleClick} fluid>{`有${this.state.content}条新信息`}</Button>
        )}
      </div>
    );
  }
}

const QUERY_ALL_MESSAGES = gql`
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

export default withApollo(NotificationBar);
