import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
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
import { getOwnItems } from '../actions/item';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

function App({ dispatchGetOwnItems }) {
  dispatchGetOwnItems();
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

App.propTypes = {
  dispatchGetOwnItems: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchGetOwnItems: getOwnItems,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(App);
export default ConnectedComponent;
