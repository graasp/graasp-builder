import React from 'react';
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
import SharedItems from './SharedItems';
import Main from './main/Main';
import Authorization from './common/Authorization';
import { EditItemModalProvider } from './context/EditItemModalContext';
import { CopyItemModalProvider } from './context/CopyItemModalContext';
import { MoveItemModalProvider } from './context/MoveItemModalContext';
import { ShareItemModalProvider } from './context/ShareItemModalContext';
import { ItemLayoutModeProvider } from './context/ItemLayoutModeContext';

const App = () => (
  <EditItemModalProvider>
    <CopyItemModalProvider>
      <MoveItemModalProvider>
        <ShareItemModalProvider>
          <ItemLayoutModeProvider>
            <Router>
              <Main>
                <Switch>
                  <Route
                    path={HOME_PATH}
                    exact
                    component={Authorization()(Home)}
                  />
                  <Route
                    path={SHARED_ITEMS_PATH}
                    exact
                    component={Authorization()(SharedItems)}
                  />
                  <Route
                    path={buildItemPath()}
                    component={Authorization()(ItemScreen)}
                  />
                  <Route
                    path={ITEMS_PATH}
                    exact
                    component={Authorization()(Home)}
                  />
                  <Redirect to={HOME_PATH} />
                </Switch>
              </Main>
            </Router>
          </ItemLayoutModeProvider>
        </ShareItemModalProvider>
      </MoveItemModalProvider>
    </CopyItemModalProvider>
  </EditItemModalProvider>
);

export default App;
