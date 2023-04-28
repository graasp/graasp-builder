import { FC } from 'react';
import { useLocation } from 'react-router';
import { Route, Routes } from 'react-router-dom';

import { saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { DOMAIN, SIGN_IN_PATH } from '../config/constants';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  ITEMS_PATH,
  MEMBER_PROFILE_PATH,
  RECYCLE_BIN_PATH,
  REDIRECT_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../config/paths';
import RecycleBinScreen from './RecycleBinScreen';
import SharedItems from './SharedItems';
import { useCurrentUserContext } from './context/CurrentUserContext';
import FavoriteItems from './main/FavoriteItems';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';
import Redirect from './main/Redirect';
import MemberProfileScreen from './member/MemberProfileScreen';

const App: FC = () => {
  const { pathname } = useLocation();
  const { data: currentMember, isLoading } = useCurrentUserContext();

  console.log(currentMember);

  if (isLoading) {
    return <CustomInitialLoader />;
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
      <Route path={HOME_PATH} element={<HomeWithAuthorization />} />
      <Route path={SHARED_ITEMS_PATH} element={<SharedWithAuthorization />} />
      <Route
        path={FAVORITE_ITEMS_PATH}
        element={<FavoriteWithAuthorization />}
      />
      <Route path={buildItemPath()} element={<ItemScreen />} />
      <Route path={MEMBER_PROFILE_PATH} element={<MemberWithAuthorization />} />
      <Route path={RECYCLE_BIN_PATH} element={<RecycleWithAuthorization />} />
      <Route path={ITEMS_PATH} element={<HomeWithAuthorization />} />
      <Route path={REDIRECT_PATH} element={<Redirect />} />
      <Route element={<Redirect />} />
    </Routes>
  );
};

export default App;
