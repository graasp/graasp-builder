import { useParams } from 'react-router-dom';

import { ItemLoginAuthorization } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '@/config/selectors';

import ItemForbiddenScreen from '../../main/list/ItemForbiddenScreen';

const { useItem, useCurrentMember, useItemLoginSchemaType } = hooks;

const ItemLoginWrapper = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();
  const { data: currentAccount, isLoading: isCurrentAccountLoading } =
    useCurrentMember();
  const { itemId } = useParams();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const { data: itemLoginSchemaType, isLoading: isItemLoginSchemaTypeLoading } =
    useItemLoginSchemaType({ itemId });

  const forbiddenContent = <ItemForbiddenScreen />;

  if (!itemId) {
    return forbiddenContent;
  }

  return (
    <ItemLoginAuthorization
      isLoading={
        isItemLoading || isCurrentAccountLoading || isItemLoginSchemaTypeLoading
      }
      signIn={itemLoginSignIn}
      itemId={itemId}
      currentAccount={currentAccount}
      item={item}
      itemLoginSchemaType={itemLoginSchemaType}
      ForbiddenContent={forbiddenContent}
      usernameInputId={ITEM_LOGIN_SIGN_IN_USERNAME_ID}
      signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
      passwordInputId={ITEM_LOGIN_SIGN_IN_PASSWORD_ID}
    >
      {children}
    </ItemLoginAuthorization>
  );
};

export default ItemLoginWrapper;
