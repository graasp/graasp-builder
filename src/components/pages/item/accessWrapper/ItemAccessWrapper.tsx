import { Outlet, useParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import { ForbiddenContent, ItemLoginScreen } from '@graasp/ui';

import LoadingScreen from '@/components/layout/LoadingScreen';
import EnrollContent from '@/components/pages/item/accessWrapper/EnrollContent';
import RequestAccessContent from '@/components/pages/item/accessWrapper/RequestAccessContent';
import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '@/config/selectors';

const { useItem, useCurrentMember, useItemLoginSchemaType } = hooks;

const ItemAccessWrapper = (): JSX.Element => {
  const { itemId } = useParams();
  const { data: item, isLoading: itemIsLoading } = useItem(itemId);
  const { data: currentMember, isLoading: currentMemberIsLoading } =
    useCurrentMember();
  const { data: itemLoginSchemaType, isLoading: itemLoginSchemaTypeIsLoading } =
    useItemLoginSchemaType({ itemId });

  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();

  if (itemId) {
    // user has access to item - show item
    if (item) {
      return <Outlet context={{ item }} />;
    }

    if (currentMember) {
      // user is logged in and item login enabled - request automatic membership
      if (itemLoginSchemaType) {
        return <EnrollContent itemId={itemId} />;
      }

      // user is logged in and item login disabled - request access
      return <RequestAccessContent itemId={itemId} member={currentMember} />;
    }

    // user is logged out and has item login enabled - show form
    if (itemLoginSchemaType) {
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

  // item is not defined or user is logged out
  return (
    <Stack
      id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <ForbiddenContent />
    </Stack>
  );
};

export default ItemAccessWrapper;
