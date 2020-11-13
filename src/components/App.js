import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Header from './layout/Header';
import Items from './main/Items';
import items from '../data/sample';
import Register from './Register';
import { REGISTER_PATH, SIGN_IN_PATH } from '../config/paths';
import SignIn from './SignIn';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  return (
    <Router>
      <div>
        <Header />
        <main className={classes.root}>
          <Switch>
            <Route path="/items" exact>
              <Items items={items} />
            </Route>
            <Route path="/items/:itemId">
              <Items items={items} />
            </Route>
            <Route path={SIGN_IN_PATH} exact>
              <SignIn />
            </Route>
            <Route path={REGISTER_PATH} exact>
              <Register />
            </Route>
            <Route path="/" exact>
              <Redirect to="/items" />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
