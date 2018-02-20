import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Visibility,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

import whole from '../assets/whole.png';
import newM from '../assets/newM.png';
import bar from '../assets/bar.png';

const centered = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default class HomepageLayout extends Component {
  state = {};

  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign="center"
          style={{ minHeight: '100vh', padding: '1em 0em' }}
          vertical
        >
          <Container>
            <Navbar />
          </Container>

          <Container text>
            <Header
              as="h1"
              content="饭否"
              inverted
              style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
            />
            <Header
              as="h2"
              inverted
              content="饭否，随时随地记录与分享!"
              style={{ fontSize: '1.7em', fontWeight: 'normal' }}
            />
            <Button primary size="huge">
              <Link to="/register" style={{ color: '#FFF' }}>
                立即注册
              </Link>
              <Icon name="right arrow" />
            </Button>
          </Container>
        </Segment>

        <Segment style={{ padding: '3em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              {/* <Grid.Column width={0}>
                <Header as="h3" style={{ fontSize: '2em' }}>
                  We Help Companies and Companions
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  We can give your company superpowers to do things that they never thought
                  possible. Let us delight your customers and empower your needs... through pure
                  data analytics.
                </p>
                <Header as="h3" style={{ fontSize: '2em' }}>
                  We Make Bananas That Can Dance
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Yes that's right, you thought it was the stuff of  dreams, but even bananas can be
                  bioengineered.
                </p>
              </Grid.Column> */}
              <Grid.Column width={16} textAlign="center">
                <div style={centered}>
                  <Image bordered rounded size="huge" src={whole} />
                </div>
              </Grid.Column>
            </Grid.Row>
            {/* <Grid.Row>
              <Grid.Column textAlign="center">
                <Button size="huge">Check Them Out</Button>
              </Grid.Column>
            </Grid.Row> */}
          </Grid>
        </Segment>
        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled="internally" columns="equal" stackable>
            <Grid.Row textAlign="center">
              <Grid.Column style={{ paddingBottom: '2em', paddingTop: '2em', ...centered }}>
                <Image bordered rounded size="large" src={bar} />
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '2em', paddingTop: '2em', ...centered }}>
                <Image bordered rounded size="large" src={newM} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment style={{ padding: '3em 0em' }} vertical>
          <Container text>
            <Header as="h3" style={{ fontSize: '2em' }}>
              简介
            </Header>
            <p style={{ fontSize: '1.33em' }}>这是一个简化版本的饭否</p>
            <p style={{ fontSize: '0.76em' }}>更多功能敬请期待...</p>

            <Divider />
            <Header as="h3" style={{ fontSize: '2em' }}>
              技术
            </Header>
            <List>
              <List.Item>React</List.Item>
              <List.Item>Semantic-UI</List.Item>
              <List.Item>Graphql</List.Item>
              <List.Item>React-Apollo</List.Item>
              <List.Item>MongoDB</List.Item>
            </List>
          </Container>
        </Segment>
        <Segment inverted vertical style={{ padding: '3em 0em', fontSize: '1em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as="h4" content="关于" />
                  <List link inverted>
                    <List.Item>联系我们</List.Item>
                    <List.Item>联系我们</List.Item>
                    <List.Item>联系我们</List.Item>
                    <List.Item>联系我们</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as="h4" content="客服" />
                  <List link inverted>
                    <List.Item>热线</List.Item>
                    <List.Item>常见问题</List.Item>
                    <List.Item>意见反馈</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={7}>
                  <Header as="h4" inverted>
                    版权所有
                  </Header>
                  <p>广播电视节目制作经营许可证（京）字第04005号.</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </div>
    );
  }
}
