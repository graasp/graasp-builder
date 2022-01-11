import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  HOME_PATH,
  ITEMS_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
  REDIRECT_PATH,
  MEMBER_PROFILE_PATH,
  FAVORITE_ITEMS_PATH,
  RECYCLE_BIN_PATH,
} from '../config/paths';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';
import SharedItems from './SharedItems';
import ModalProviders from './context/ModalProviders';
import Redirect from './main/Redirect';
import MemberProfileScreen from './member/MemberProfileScreen';
import FavoriteItems from './main/FavoriteItems';
import RecycleBinScreen from './RecycleBinScreen';
import { CurrentUserContextProvider } from './context/CurrentUserContext';

const App = () => (
  <ModalProviders>
    <CurrentUserContextProvider>
      <Router>
        <Routes>
          <Route path={HOME_PATH} exact element={<Home />} />
          <Route path={SHARED_ITEMS_PATH} exact element={<SharedItems />} />
          <Route path={FAVORITE_ITEMS_PATH} exact element={<FavoriteItems />} />
          <Route path={buildItemPath()} element={<ItemScreen />} />
          <Route
            path={MEMBER_PROFILE_PATH}
            exact
            element={<MemberProfileScreen />}
          />
          <Route path={RECYCLE_BIN_PATH} exact element={<RecycleBinScreen />} />
          <Route path={ITEMS_PATH} exact element={<Home />} />
          <Route path={REDIRECT_PATH} exact element={<Redirect />} />
          <Route element={() => <Redirect />} />
        </Routes>
      </Router>
    </CurrentUserContextProvider>
  </ModalProviders>
);

export default App;
