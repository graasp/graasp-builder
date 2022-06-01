/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { API_ROUTES } from '@graasp/query-client';
import { Loader, Authorization } from '@graasp/ui';
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
import { AUTHENTICATION_HOST } from '../config/constants';

const RR = () => {
  const redirectionLink = `${AUTHENTICATION_HOST}/${API_ROUTES.buildSignInPath()}`;

  const { data: currentMember, isLoading } = useContext(CurrentUserContext);
  // {
  //   data: { size: 3 },
  //   isLoading: false,
  // };

  if (isLoading) {
    return <Loader />;
  }

  const withAuthorizationProps = {
    currentMember,
    redirectionLink,
  };
  const HomeWithAuthorization = Authorization(Home, withAuthorizationProps);
  const SharedWithAuthorization = Authorization(
    SharedItems,
    withAuthorizationProps,
  );
  const FavoriteWithAuthorization = Authorization(
    FavoriteItems,
    withAuthorizationProps,
  );
  const MemberWithAuthorization = Authorization(
    MemberProfileScreen,
    withAuthorizationProps,
  );
  const RecycleWithAuthorization = Authorization(
    RecycleBinScreen,
    withAuthorizationProps,
  );

  return (
    <Router>
      <Routes>
        <Route path={HOME_PATH} exact element={<HomeWithAuthorization />} />
        {/* <Route
          path={SHARED_ITEMS_PATH}
          exact
          element={<SharedWithAuthorization />}
        />
        <Route
          path={FAVORITE_ITEMS_PATH}
          exact
          // eslint-disable-next-line arrow-body-style
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
        <Route element={<Redirect />} /> */}
      </Routes>
    </Router>
  );
};

export default RR;
