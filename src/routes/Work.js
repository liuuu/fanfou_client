import React from 'react';
import {
  Container,
  Header,
  Menu,
  Button,
  Segment,
  Grid,
  Image,
  Form,
  TextArea,
  Item,
  Label,
  Icon,
  Image as ImageComponent,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import CreateMessageForm from '../components/CreateMessageForm';
import MessageContainer from '../components/MessageContainer';
import UserCard from '../components/UserCard';
import Navbar from '../components/Navbar';

class TimeLine extends React.Component {
  render() {
    /**
     * @props routers
     */
    const { props } = this;
    return (
      <div className="all-message">
        <div style={{ padding: '1em 0em' }}>
          <Container>
            <Navbar />

            <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'left' }}>
              <Grid container>
                <Grid.Column width={12} className="message-container">
                  <div>
                    <MessageContainer />
                  </div>
                </Grid.Column>
                <Grid.Column width={4}>
                  <div style={{ backgroundColor: '#e3f2da' }}>
                    {localStorage.getItem('userId') && <UserCard />}
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default TimeLine;
