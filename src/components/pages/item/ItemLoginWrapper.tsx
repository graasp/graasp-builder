import { Outlet, useParams } from 'react-router-dom';

import LoadingScreen from '@/components/layout/LoadingScreen';
import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '@/config/selectors';

import ItemForbiddenScreen from '../../main/list/ItemForbiddenScreen';

const { useItem, useCurrentMember, useItemLoginSchemaType } = hooks;

const ItemLoginWrapper = (): JSX.Element => {
  const { itemId } = useParams();
  const { data: item, isLoading: itemIsLoading } = useItem(itemId);
  const { data: currentMember, isLoading: currentMemberIsLoading } =
    useCurrentMember();
  const { data: itemLoginSchemaType, isLoading: itemLoginSchemaTypeIsLoading } =
    useItemLoginSchemaType({ itemId });
  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();

  if (itemId) {
    if (item) {
      return <Outlet context={{ item }} />;
    }
    if (itemLoginSchemaType && !currentMember) {
      return (
        <ItemLoginScreen
          signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
          usernameInputId={ITEM_LOGIN_SIGN_IN_USERNAME_ID}
          passwordInputId={ITEM_LOGIN_SIGN_IN_PASSWORD_ID}
          signIn={itemLoginSignIn}
          itemLoginSchemaType={itemLoginSchemaType}
          itemId={itemId}
        />
      );
    }
  }

  if (currentMemberIsLoading || itemLoginSchemaTypeIsLoading || itemIsLoading) {
    return <LoadingScreen />;
  }

  // logged in member does not have access to item
  // or logged out member cannot access item
  return (
    <ItemForbiddenScreen
      itemId={itemId}
      itemLoginSchemaType={itemLoginSchemaType}
    />
  );
};

export default ItemLoginWrapper;
