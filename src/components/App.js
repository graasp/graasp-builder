import React from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemLoginAuthorization } from '@graasp/ui';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // useParams,
} from 'react-router-dom';
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
import Authorization from './common/Authorization';
import ModalProviders from './context/ModalProviders';
import Redirect from './main/Redirect';
import MemberProfileScreen from './member/MemberProfileScreen';
import FavoriteItems from './main/FavoriteItems';
import RecycleBinScreen from './RecycleBinScreen';
import { hooks, useMutation } from '../config/queryClient';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
  ITEM_LOGIN_SIGN_IN_MODE_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '../config/selectors';

const App = () => {
  const { useCurrentMember, useItem, useItemLogin } = hooks;
  const { mutate: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { mutate: itemLoginSignIn } = useMutation(
    MUTATION_KEYS.POST_ITEM_LOGIN,
  );

  const renderItemScreen = ({ match: { params } }) => {
    const Component = ItemLoginAuthorization({
      signIn: itemLoginSignIn,
      signOut,
      itemId: params?.itemId,
      useCurrentMember,
      useItem,
      useItemLogin,
      forbiddenContentId: ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
      memberIdInputId: ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
      usernameInputId: ITEM_LOGIN_SIGN_IN_USERNAME_ID,
      signInButtonId: ITEM_LOGIN_SIGN_IN_BUTTON_ID,
      passwordInputId: ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
      modeSelectId: ITEM_LOGIN_SIGN_IN_MODE_ID,
    })(ItemScreen);
    return <Component />;
  };

  return (
    <ModalProviders>
      <Router>
        <Switch>
          <Route path={HOME_PATH} exact component={Authorization()(Home)} />
          <Route
            path={SHARED_ITEMS_PATH}
            exact
            component={Authorization()(SharedItems)}
          />
          <Route
            path={FAVORITE_ITEMS_PATH}
            exact
            component={Authorization()(FavoriteItems)}
          />
          <Route path={buildItemPath()} render={renderItemScreen} />
          <Route
            path={MEMBER_PROFILE_PATH}
            exact
            component={Authorization()(MemberProfileScreen)}
          />
          <Route
            path={RECYCLE_BIN_PATH}
            exact
            component={Authorization()(RecycleBinScreen)}
          />
          <Route path={ITEMS_PATH} exact component={Authorization()(Home)} />
          <Route
            path={REDIRECT_PATH}
            exact
            component={Authorization()(Redirect)}
          />
          <Redirect to={HOME_PATH} />
        </Switch>
      </Router>
    </ModalProviders>
  );
};

export default App;
