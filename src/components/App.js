import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import items from '../data/sample';
import SignUp from './SignUp';
import {
  SIGN_UP_PATH,
  SIGN_IN_PATH,
  HOME_PATH,
  ITEMS_PATH,
  SHARED_ITEMS_PATH,
} from '../config/paths';
import SignIn from './SignIn';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';
import MoveItemModal from './main/MoveItemModal';
import EditItemModal from './main/EditItemModal';
import CopyItemModal from './main/CopyItemModal';
import ShareItemModal from './main/ShareItemModal';
import SharedItems from './SharedItems';
import Main from './main/Main';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <>
        <MoveItemModal />
        <CopyItemModal />
        <EditItemModal />
        <ShareItemModal />
        <Router>
          <Main>
            <Switch>
              <Route path={SIGN_IN_PATH} exact>
                <SignIn />
              </Route>
              <Route path={SIGN_UP_PATH} exact>
                <SignUp />
              </Route>
              <Route path={HOME_PATH} exact>
                <Home />
              </Route>
              <Route path={SHARED_ITEMS_PATH} exact>
                <SharedItems />
              </Route>
              <Route path="/items/:itemId">
                <ItemScreen items={items} />
              </Route>
              <Route path={ITEMS_PATH} exact>
                <Home />
              </Route>
              <Redirect to={HOME_PATH} />
            </Switch>
          </Main>
        </Router>
      </>
    );
  }
}

export default App;
