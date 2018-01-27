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

const ContainerExampleFluid = () => (
  <div>
    <Segment textAlign="center" style={{ minHeight: 100, padding: '1em 0em' }} vertical>
      <Container>
        <Menu pointing secondary size="large">
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
          <Menu.Item position="right">
            <Button>Log in</Button>
            <Button style={{ marginLeft: '0.5em' }}>Sign Up</Button>
          </Menu.Item>
        </Menu>

        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'left' }}>
          <Grid container>
            <Grid.Column width={12}>
              <div>
                <CreateMessageForm />
                <MessageContainer />
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div style={{ backgroundColor: '#e3f2da' }}>
                <p>
                  Domestic dogs inherited complex behaviors, such as bite inhibition, from their
                  wolf ancestors, which would have been pack hunters with complex body language.
                  These sophisticated forms of social cognition and communication may account for
                  their trainability, playfulness, and ability to fit into human households and
                  social situations, and these attributes have given dogs a relationship with humans
                  that has enabled them to become one of the most successful species on the planet
                  today.
                </p>
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    </Segment>
  </div>
);

export default ContainerExampleFluid;
