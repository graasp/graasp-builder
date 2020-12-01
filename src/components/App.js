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
import SignUp from './SignUp';
import { SIGN_UP_PATH, SIGN_IN_PATH } from '../config/paths';
import SignIn from './SignIn';
import { ItemProvider } from './context/item';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  return (
    <Router>
      <ItemProvider>
        <div>
          <Header />
          <main className={classes.root}>
            <Switch>
              <Route path="/items" exact>
                <Items />
              </Route>
              <Route path="/items/:itemId">
                <Items items={items} />
              </Route>
              <Route path={SIGN_IN_PATH} exact>
                <SignIn />
              </Route>
              <Route path={SIGN_UP_PATH} exact>
                <SignUp />
              </Route>
              <Route path="/" exact>
                <Redirect to="/items" />
              </Route>
              <Redirect to="/items" />
            </Switch>
          </main>
        </div>
      </ItemProvider>
    </Router>
  );
}

export default App;
