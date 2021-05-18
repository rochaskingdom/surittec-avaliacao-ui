import React from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './pages/login/Login';
import Home from './pages/home/Home';
import ClienteForm from './pages/cliente/ClienteForm';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/cliente/new" component={ClienteForm} />
        <Route path="/cliente/edit/:id" component={ClienteForm} />
        <Route path="/cliente/view/:id" component={ClienteForm} />
      </Switch>
    </BrowserRouter>
  );
}
