import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { saveUrlForRedirection } from '@graasp/sdk';
import { Loader, withAuthorization } from '@graasp/ui';
import { useLocation } from 'react-router';
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
import Redirect from './main/Redirect';
import MemberProfileScreen from './member/MemberProfileScreen';
import FavoriteItems from './main/FavoriteItems';
import RecycleBinScreen from './RecycleBinScreen';
import { CurrentUserContext } from './context/CurrentUserContext';
import { DOMAIN, SIGN_IN_PATH } from '../config/constants';

const App = () => {
  const { pathname } = useLocation();
  const { data: currentMember, isLoading } = useContext(CurrentUserContext);

  if (isLoading) {
    return <Loader />;
  }

  const withAuthorizationProps = {
    currentMember,
    redirectionLink: SIGN_IN_PATH,
    onRedirect: () => {
      // save current url for later redirection after sign in
      saveUrlForRedirection(pathname, DOMAIN);
    },
  };
  const HomeWithAuthorization = withAuthorization(Home, withAuthorizationProps);
  const SharedWithAuthorization = withAuthorization(
    SharedItems,
    withAuthorizationProps,
  );
  const FavoriteWithAuthorization = withAuthorization(
    FavoriteItems,
    withAuthorizationProps,
  );
  const MemberWithAuthorization = withAuthorization(
    MemberProfileScreen,
    withAuthorizationProps,
  );
  const RecycleWithAuthorization = withAuthorization(
    RecycleBinScreen,
    withAuthorizationProps,
  );

  return (
    <Routes>
      <Route path={HOME_PATH} exact element={<HomeWithAuthorization />} />
      <Route
        path={SHARED_ITEMS_PATH}
        exact
        element={<SharedWithAuthorization />}
      />
      <Route
        path={FAVORITE_ITEMS_PATH}
        exact
        element={<FavoriteWithAuthorization />}
      />
      <Route path={buildItemPath()} element={<ItemScreen />} />
      <Route
        path={MEMBER_PROFILE_PATH}
        exact
        element={<MemberWithAuthorization />}
      />
      <Route
        path={RECYCLE_BIN_PATH}
        exact
        element={<RecycleWithAuthorization />}
      />
      <Route path={ITEMS_PATH} exact element={<HomeWithAuthorization />} />
      <Route path={REDIRECT_PATH} exact element={<Redirect />} />
      <Route element={<Redirect />} />
    </Routes>
  );
};

export default App;
