import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './routes/Home';
import Register from './routes/Register';
import Work from './routes/Work';
import DisplayMessage from './routes/DisplayMessage';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" exact component={Register} />
          <Route path="/work" exact component={Work} />
          <Route path="/message/:messageId" exact component={DisplayMessage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
