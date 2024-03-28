import { Outlet, useLocation } from 'react-router';
import { Route, Routes } from 'react-router-dom';

import { buildSignInPath, saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { DOMAIN, GRAASP_AUTH_HOST } from '@/config/env';

import {
  BOOKMARKED_ITEMS_PATH,
  HOME_PATH,
  ITEMS_PATH,
  ITEM_INFORMATION_PATH,
  ITEM_PUBLISH_PATH,
  ITEM_SETTINGS_PATH,
  ITEM_SHARE_PATH,
  PUBLISHED_ITEMS_PATH,
  RECYCLE_BIN_PATH,
  REDIRECT_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../config/paths';
import { hooks } from '../config/queryClient';
import { useCurrentUserContext } from './context/CurrentUserContext';
import Main from './main/Main';
import Redirect from './main/Redirect';
import BookmarkedItemsScreen from './pages/BookmarkedItemsScreen';
import HomeScreen from './pages/HomeScreen';
import PublishedItemsScreen from './pages/PublishedItemsScreen';
import RecycledItemsScreen from './pages/RecycledItemsScreen';
import SharedItemsScreen from './pages/SharedItemsScreen';
import ItemInformationPage from './pages/item/ItemInformationPage';
import ItemPageLayout from './pages/item/ItemPageLayout';
import ItemScreen from './pages/item/ItemScreen';
import ItemScreenLayout from './pages/item/ItemScreenLayout';
import ItemSettingsPage from './pages/item/ItemSettingsPage';
import ItemSharingPage from './pages/item/ItemSharingPage';
import LibrarySettingsPage from './pages/item/LibrarySettingsPage';

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
    redirectionLink: buildSignInPath({
      host: GRAASP_AUTH_HOST,
      redirectionUrl: window.location.toString(),
    }),
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
    BookmarkedItemsScreen,
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
      <Route
        element={
          <Main>
            <Outlet />
          </Main>
        }
      >
        <Route path={HOME_PATH} element={<HomeWithAuthorization />} />
        <Route path={SHARED_ITEMS_PATH} element={<SharedWithAuthorization />} />
        <Route
          path={BOOKMARKED_ITEMS_PATH}
          element={<FavoriteWithAuthorization />}
        />
        <Route
          path={PUBLISHED_ITEMS_PATH}
          element={<PublishedWithAuthorization />}
        />
        <Route path={buildItemPath()} element={<ItemScreenLayout />}>
          <Route index element={<ItemScreen />} />
          <Route element={<ItemPageLayout />}>
            <Route path={ITEM_SHARE_PATH} element={<ItemSharingPage />} />
            <Route path={ITEM_PUBLISH_PATH} element={<LibrarySettingsPage />} />
            <Route path={ITEM_SETTINGS_PATH} element={<ItemSettingsPage />} />
            <Route
              path={ITEM_INFORMATION_PATH}
              element={<ItemInformationPage />}
            />
          </Route>
        </Route>
        <Route path={RECYCLE_BIN_PATH} element={<RecycleWithAuthorization />} />
        <Route path={buildItemPath()} element={<ItemScreen />} />
        <Route path={ITEMS_PATH} element={<HomeWithAuthorization />} />
        <Route path={REDIRECT_PATH} element={<Redirect />} />
        <Route path="*" element={<Redirect />} />
      </Route>
    </Routes>
  );
};

export default App;
