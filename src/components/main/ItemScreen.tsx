import { useEffect } from 'react';

import { ItemType } from '@graasp/sdk';
import {
  ItemLoginAuthorization,
  Loader,
  useShortenURLParams,
} from '@graasp/ui';

import { ITEM_ID_PARAMS } from '@/config/paths';

import { PERMISSIONS_EDITION_ALLOWED } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
  ITEM_LOGIN_SIGN_IN_MODE_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '../../config/selectors';
import { ItemActionTabs } from '../../enums';
import { getHighestPermissionForMemberFromMemberships } from '../../utils/membership';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useLayoutContext } from '../context/LayoutContext';
import FileUploader from '../file/FileUploader';
import { UppyContextProvider } from '../file/UppyContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemPublishTab from '../item/publish/ItemPublishTab';
import ItemSettings from '../item/settings/ItemSettings';
import ItemSharingTab from '../item/sharing/ItemSharingTab';
import ItemForbiddenScreen from './ItemForbiddenScreen';
import Main from './Main';

const {
  useItem,
  useCurrentMember,
  useItemLoginSchemaType,
  useItemMemberships,
} = hooks;

const ItemScreen = (): JSX.Element => {
  const itemId = useShortenURLParams(ITEM_ID_PARAMS);

  const { data: item, isError, isLoading } = useItem(itemId);
  const { setEditingItemId, openedActionTabId, setOpenedActionTabId } =
    useLayoutContext();
  const { data: currentMember } = useCurrentUserContext();
  const {
    data: memberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = useItemMemberships(itemId);

  useEffect(() => {
    setEditingItemId(null);
    setOpenedActionTabId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (isLoading || isLoadingItemMemberships) {
    return <Loader />;
  }

  if (!itemId || !item || isError || isErrorItemMemberships) {
    return <ErrorAlert />;
  }

  const itemMembership = getHighestPermissionForMemberFromMemberships({
    memberships,
    memberId: currentMember?.id,
  });
  const permission = itemMembership?.permission;
  const enableEditing = permission
    ? PERMISSIONS_EDITION_ALLOWED.includes(permission)
    : false;

  const content = (() => {
    if (openedActionTabId === ItemActionTabs.Settings && enableEditing) {
      return <ItemSettings item={item} />;
    }

    switch (openedActionTabId) {
      case ItemActionTabs.Sharing: {
        return <ItemSharingTab item={item} memberships={memberships} />;
      }
      case ItemActionTabs.Library: {
        return <ItemPublishTab item={item} permission={permission} />;
      }
      default:
        return <ItemContent item={item} permission={permission} />;
    }
  })();

  return (
    <Main>
      <UppyContextProvider enable={enableEditing} itemId={itemId}>
        {item.type === ItemType.FOLDER ? <FileUploader /> : undefined}
        <ItemMain item={item}>{content}</ItemMain>
      </UppyContextProvider>
    </Main>
  );
};

const WrappedItemScreen = (): JSX.Element => {
  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();
  const itemId = useShortenURLParams(ITEM_ID_PARAMS);

  const ForbiddenContent = <ItemForbiddenScreen />;

  if (!itemId) {
    return ForbiddenContent;
  }

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    itemId,
    // TODO: do not use empty user for current member
    useCurrentMember,
    useItem,
    useItemLoginSchemaType,
    ForbiddenContent,
    memberIdInputId: ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
    usernameInputId: ITEM_LOGIN_SIGN_IN_USERNAME_ID,
    signInButtonId: ITEM_LOGIN_SIGN_IN_BUTTON_ID,
    passwordInputId: ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
    modeSelectId: ITEM_LOGIN_SIGN_IN_MODE_ID,
  })(ItemScreen);
  return <Component />;
};

export default WrappedItemScreen;
