import { useLocation } from 'react-router';
import { Route, Routes } from 'react-router-dom';

import { saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { DOMAIN } from '@/config/env';
import { SIGN_IN_PATH } from '@/config/externalPaths';

import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  ITEMS_PATH,
  PUBLISHED_ITEMS_PATH,
  RECYCLE_BIN_PATH,
  REDIRECT_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../config/paths';
import { hooks } from '../config/queryClient';
import { useCurrentUserContext } from './context/CurrentUserContext';
import Redirect from './main/Redirect';
import FavoriteItemsScreen from './pages/FavoriteItemsScreen';
import HomeScreen from './pages/HomeScreen';
import ItemScreen from './pages/ItemScreen';
import PublishedItemsScreen from './pages/PublishedItemsScreen';
import RecycledItemsScreen from './pages/RecycledItemsScreen';
import SharedItemsScreen from './pages/SharedItemsScreen';

const { useItemFeedbackUpdates } = hooks;

const App = (): JSX.Element => {
  const { pathname } = useLocation();
  const { data: currentMember, isLoading } = useCurrentUserContext();

  // registers the item updates through websockets
  useItemFeedbackUpdates?.(currentMember?.id);

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
  const HomeWithAuthorization = withAuthorization(
    HomeScreen,
    withAuthorizationProps,
  );
  const SharedWithAuthorization = withAuthorization(
    SharedItemsScreen,
    withAuthorizationProps,
  );
  const FavoriteWithAuthorization = withAuthorization(
    FavoriteItemsScreen,
    withAuthorizationProps,
  );
  const PublishedWithAuthorization = withAuthorization(
    PublishedItemsScreen,
    withAuthorizationProps,
  );
  const RecycleWithAuthorization = withAuthorization(
    RecycledItemsScreen,
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
      <Route
        path={PUBLISHED_ITEMS_PATH}
        element={<PublishedWithAuthorization />}
      />
      <Route path={RECYCLE_BIN_PATH} element={<RecycleWithAuthorization />} />
      <Route path={buildItemPath()} element={<ItemScreen />} />
      <Route path={ITEMS_PATH} element={<HomeWithAuthorization />} />
      <Route path={REDIRECT_PATH} element={<Redirect />} />
      <Route path="*" element={<Redirect />} />
    </Routes>
  );
};

export default App;
