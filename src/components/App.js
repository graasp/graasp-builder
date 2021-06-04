import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  HOME_PATH,
  ITEMS_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
  REDIRECT_PATH,
} from '../config/paths';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';
import SharedItems from './SharedItems';
import Main from './main/Main';
import Authorization from './common/Authorization';
import ModalProviders from './context/ModalProviders';
import ItemLoginAuthorization from './common/ItemLoginAuthorization';
import Redirect from './main/Redirect';

const App = () => (
  <ModalProviders>
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
            component={ItemLoginAuthorization()(ItemScreen)}
          />
          <Route path={ITEMS_PATH} exact component={Authorization()(Home)} />
          <Route
            path={REDIRECT_PATH}
            exact
            component={Authorization()(Redirect)}
          />
          <Redirect to={HOME_PATH} />
        </Switch>
      </Main>
    </Router>
  </ModalProviders>
);

export default App;
