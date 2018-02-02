import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Home from './routes/Home';
import Register from './routes/Register';
import Work from './routes/Work';
import DisplayMessage from './routes/DisplayMessage';
import DisplayUser from './routes/DisplayUser';
import './App.css';

const isAuthenticated = () => {
  return localStorage.getItem('xtoken');
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/register',
          }}
        />
      )
    }
  />
);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" exact component={Register} />
          <PrivateRoute path="/work" exact component={Work} />
          <Route path="/message/:messageId" exact component={DisplayMessage} />
          <Route path="/user/:userId" exact component={DisplayUser} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
