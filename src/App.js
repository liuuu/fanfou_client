import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './routes/Home';
import Register from './routes/Register';
import Work from './routes/Work';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" exact component={Register} />
          <Route path="/work" exact component={Work} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
