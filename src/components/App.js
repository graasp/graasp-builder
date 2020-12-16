import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Header from './layout/Header';
import items from '../data/sample';
import SignUp from './SignUp';
import {
  SIGN_UP_PATH,
  SIGN_IN_PATH,
  HOME_PATH,
  ITEMS_PATH,
} from '../config/paths';
import SignIn from './SignIn';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';

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
            <Route path={HOME_PATH} exact>
              <Home />
            </Route>
            <Route path="/items/:itemId">
              <ItemScreen items={items} />
            </Route>
            <Route path={SIGN_IN_PATH} exact>
              <SignIn />
            </Route>
            <Route path={SIGN_UP_PATH} exact>
              <SignUp />
            </Route>
            <Route path={ITEMS_PATH} exact>
              <Home />
            </Route>
            <Redirect to={HOME_PATH} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
