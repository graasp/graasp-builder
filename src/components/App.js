import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  HOME_PATH,
  ITEMS_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../config/paths';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';
import MoveItemModal from './main/MoveItemModal';
import EditItemModal from './main/EditItemModal';
import CopyItemModal from './main/CopyItemModal';
import ShareItemModal from './main/ShareItemModal';
import SharedItems from './SharedItems';
import Main from './main/Main';
import Authorization from './common/Authorization';

const App = () => (
  <>
    <MoveItemModal />
    <CopyItemModal />
    <EditItemModal />
    <ShareItemModal />
    <Router>
      <Main>
        <Switch>
          <Route path={HOME_PATH} exact component={Authorization()(Home)} />
          <Route
            path={SHARED_ITEMS_PATH}
            exact
            component={Authorization()(SharedItems)}
          />
          <Route
            path={buildItemPath()}
            component={Authorization()(ItemScreen)}
          />
          <Route path={ITEMS_PATH} exact component={Authorization()(Home)} />
          <Redirect to={HOME_PATH} />
        </Switch>
      </Main>
    </Router>
  </>
);

App.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
