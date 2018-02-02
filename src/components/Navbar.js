import React, { Component } from 'react';
import { Menu, Button, Image } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import fanfou from '../fanfou_beta.png';

import styled from 'styled-components';

class Navbar extends Component {
  handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('xtoken');
    this.props.history.replace('/');
  };
  render() {
    const isLogin = localStorage.getItem('userId');
    return (
      <Menu size="large" as="div" secondary className="nav-bar">
        <Menu.Item as="a" header>
          <Image size="small" src={fanfou} style={{ marginRight: '1.5em' }} />
        </Menu.Item>

        <Menu.Item>
          <Link to="/" style={{ color: '#59cdfb' }}>
            首页
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/work" style={{ color: '#59cdfb' }}>
            微博
          </Link>
        </Menu.Item>

        {isLogin ? (
          <Menu.Item position="right">
            <a onClick={this.handleLogout} style={{ color: '#59cdfb' }}>
              退出
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item position="right">
            <Link to="/register" style={{ color: '#59cdfb' }}>
              登录/
            </Link>

            <Link to="/register" style={{ color: '#59cdfb' }}>
              注册
            </Link>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

export default withRouter(Navbar);
