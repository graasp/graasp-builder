import { Outlet, useParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import {
  AccountType,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { ForbiddenContent, ItemLoginWrapper } from '@graasp/ui';

import Redirect from '@/components/main/Redirect';
import EnrollContent from '@/components/pages/item/accessWrapper/EnrollContent';
import RequestAccessContent from '@/components/pages/item/accessWrapper/RequestAccessContent';
import { axios, hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '@/config/selectors';

const ItemAccessWrapper = (): JSX.Element => {
  const { itemId } = useParams();
  const {
    data: item,
    isLoading: itemIsLoading,
    error: itemError,
  } = hooks.useItem(itemId);
  const { data: currentMember, isLoading: currentMemberIsLoading } =
    hooks.useCurrentMember();
  const { data: itemLoginSchemaType, isLoading: itemLoginSchemaTypeIsLoading } =
    hooks.useItemLoginSchemaType({ itemId });

  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();

  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
    : false;

  const canAdmin = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin)
    : false;

  if (!itemId) {
    return <Redirect />;
  }
  const errorStatusCode =
    (axios.isAxiosError(itemError) && itemError.status) || null;
  return (
    <ItemLoginWrapper
      item={item}
      itemErrorStatusCode={errorStatusCode}
      currentAccount={currentMember}
      enrollContent={<EnrollContent itemId={itemId} />}
      signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
      usernameInputId={ITEM_LOGIN_SIGN_IN_USERNAME_ID}
      passwordInputId={ITEM_LOGIN_SIGN_IN_PASSWORD_ID}
      signIn={itemLoginSignIn}
      itemLoginSchemaType={itemLoginSchemaType}
      itemId={itemId}
      isLoading={
        currentMemberIsLoading || itemLoginSchemaTypeIsLoading || itemIsLoading
      }
      requestAccessContent={
        currentMember?.type === AccountType.Individual ? (
          <RequestAccessContent itemId={itemId} member={currentMember} />
        ) : undefined
      }
      forbiddenContent={
        <Stack
          id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID}
          direction="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          gap={2}
        >
          <ForbiddenContent id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID} />
        </Stack>
      }
    >
      <Outlet
        context={{ item, permission: item?.permission, canWrite, canAdmin }}
      />
    </ItemLoginWrapper>
  );
};

export default ItemAccessWrapper;
