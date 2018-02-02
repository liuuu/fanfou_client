import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react';
import logo from '../logo.svg';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import fanfou from '../fanfou_beta.png';

@observer
class LoginForm extends Component {
  @observable isLoginForm = true;

  @observable email = '';
  @observable username = '';
  @observable password = '';
  @observable confirmPassword = '';
  @observable error = false;

  @action
  handleChoose = () => {
    this.password = '';
    this.confirmPassword = '';
    this.email = '';
    this.username = '';
    this.error = false;
    this.isLoginForm = !this.isLoginForm;
  };

  @action
  handleEmail = e => {
    this.email = e.target.value;
  };

  @action
  handlePassword = e => {
    this.password = e.target.value;
  };
  @action
  handleConfirmPassword = e => {
    this.confirmPassword = e.target.value;
    if (this.confirmPassword !== this.password) {
      this.error = true;
    } else {
      this.error = false;
    }
  };
  @action
  handleLazy = () => {
    this.password = 'test';
    this.email = 'test@gmail.com';
  };

  saveUserData = (id, token, avatarUrl, name) => {
    localStorage.setItem('xtoken', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('avatarUrl', avatarUrl);
    localStorage.setItem('name', name);
  };

  handleSubmit = async () => {
    console.log('handleSubmit');

    if (this.isLoginForm) {
      const result = await this.props.authenticateUserMutation({
        variables: {
          email: this.email,
          password: this.password,
        },
      });

      const { user, ok, error } = result.data.login;
      if (error) {
        return alert(error);
      }
      this.saveUserData(user._id, user.token, user.avatarUrl, user.name);
      this.props.history.push('/work');
    } else {
      // sign up process
      const result = await this.props.signupUserMutation({
        variables: {
          name: this.username,
          email: this.email,
          password: this.password,
        },
      });
      console.log('sign result', result);

      const { user, ok, error } = result.data.signup;
      if (error) {
        return alert(error);
      }
      this.saveUserData(user._id, user.token, user.avatarUrl, user.name);
      this.props.history.push('/work');
    }
    // this.props.history.push('/');
  };

  // @computed get matchedPass (){
  //   if(!this.isLoginForm && this.password===this.confirmPassword){
  //     return
  //   }
  //   return true
  // }

  render() {
    return (
      <div className="login-form">
        {this.isLoginForm && (
          <Grid
            style={{ height: '100%', margin: '0 auto', paddingTop: '100px' }}
            textAlign="center"
            // verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" color="teal" textAlign="center">
                <Image size="massive" src={fanfou} />
              </Header>
              <Form size="large">
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                    value={this.email}
                    onChange={this.handleEmail}
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    value={this.password}
                    onChange={this.handlePassword}
                  />

                  <Button color="teal" fluid size="large" onClick={this.handleSubmit}>
                    登录
                  </Button>
                </Segment>
              </Form>
              <ChooseForm handleChoose={this.handleChoose} isLoginForm={this.isLoginForm} />
            </Grid.Column>
          </Grid>
        )}
        {!this.isLoginForm && (
          <Grid
            textAlign="center"
            style={{ height: '100%', margin: '0 auto', paddingTop: '100px' }}
            // verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" color="teal" textAlign="center">
                <Image size="massive" src={fanfou} />
              </Header>
              <Form size="large">
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="username"
                    value={this.username}
                    onChange={e => {
                      this.username = e.target.value;
                    }}
                  />
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                    value={this.email}
                    onChange={this.handleEmail}
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    value={this.password}
                    onChange={this.handlePassword}
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    error={this.error}
                    value={this.confirmPassword}
                    onChange={this.handleConfirmPassword}
                  />

                  <Button
                    fluid
                    color="teal"
                    size="large"
                    disabled={this.error}
                    onClick={this.handleSubmit}
                  >
                    {this.isLoginForm ? '登录' : '注册'}
                  </Button>
                </Segment>
              </Form>
              <ChooseForm handleChoose={this.handleChoose} isLoginForm={this.isLoginForm} />
            </Grid.Column>
          </Grid>
        )}
        <div className="show-pass">
          <Button color="facebook">
            <Icon name="mail" /> test@gmail.com
          </Button>
          <Button color="twitter">
            <Icon name="lock" /> test
          </Button>
          {this.isLoginForm && (
            <Button color="twitter" color="green" onClick={this.handleLazy}>
              不想打字? 点击我
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const ChooseForm = ({ handleChoose, isLoginForm }) => {
  return (
    <Message>
      {!isLoginForm ? `已有账号?` : `新用户?`}
      {!isLoginForm ? (
        <button onClick={handleChoose}>登录</button>
      ) : (
        <button onClick={handleChoose}>注册</button>
      )}
    </Message>
  );
};

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      user {
        name
        _id
        token
        email
        avatarUrl
      }
      ok
      error
    }
  }
`;

const AUTHENTICATE_USER_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        name
        _id
        token
        email

        avatarUrl
      }
      ok
      error
    }
  }
`;

export default compose(
  graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' }),
  graphql(AUTHENTICATE_USER_MUTATION, { name: 'authenticateUserMutation' })
)(LoginForm);
