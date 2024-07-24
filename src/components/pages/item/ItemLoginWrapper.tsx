import { useParams } from 'react-router-dom';

import { ItemLoginAuthorization } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '@/config/selectors';

import ItemForbiddenScreen from '../../main/list/ItemForbiddenScreen';

const { useItem, useCurrentMember, useItemLoginSchemaType } = hooks;

const ItemLoginWrapper = (WrappedComponent: () => JSX.Element): JSX.Element => {
  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();
  const { itemId } = useParams();

  const ForbiddenContent = <ItemForbiddenScreen />;

  if (!itemId) {
    return ForbiddenContent;
  }

  const AuthComponent = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    itemId,
    useCurrentMember,
    useItem,
    useItemLoginSchemaType,
    ForbiddenContent,
    memberIdInputId: ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
    usernameInputId: ITEM_LOGIN_SIGN_IN_USERNAME_ID,
    signInButtonId: ITEM_LOGIN_SIGN_IN_BUTTON_ID,
    passwordInputId: ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  })(WrappedComponent);
  return <AuthComponent />;
};

export default ItemLoginWrapper;
