import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

class Navbar extends Component {
  handleLogout = () => {
    localStorage.removeItem('userId');
    this.props.history.replace('/');
  };
  render() {
    const isLogin = localStorage.getItem('userId');
    return (
      <Menu secondary size="large" as="div">
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

        {isLogin ? (
          <Menu.Item position="right">
            <Button onClick={this.handleLogout}>退出</Button>
          </Menu.Item>
        ) : (
          <Menu.Item position="right">
            <Button>
              <Link to="/register">登录</Link>
            </Button>
            <Button style={{ marginLeft: '0.5em' }}>
              <Link to="/register">注册</Link>
            </Button>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

export default withRouter(Navbar);
