import React, { useContext, useEffect } from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemLoginAuthorization } from '@graasp/ui';
import { useParams } from 'react-router';
import {
  getMembership,
  getHighestPermissionForMemberFromMemberships,
} from '../../utils/membership';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { LayoutContext } from '../context/LayoutContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemSettings from '../item/settings/ItemSettings';
import ItemSharingTab from '../item/sharing/ItemSharingTab';
import GraaspAnalyzer from './GraaspAnalyzer';
import Main from './Main';
import { hooks, useMutation } from '../../config/queryClient';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
  ITEM_LOGIN_SIGN_IN_MODE_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '../../config/selectors';
import { PERMISSIONS_EDITION_ALLOWED } from '../../config/constants';
import { UppyContextProvider } from '../file/UppyContext';
import FileUploader from '../file/FileUploader';

const { useItem, useItemMemberships, useCurrentMember, useItemLogin } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isError } = useItem(itemId);

  const {
    isItemSettingsOpen,
    setEditingItemId,
    setIsItemSettingsOpen,
    setIsItemSharingOpen,
    isItemSharingOpen,
    isDashboardOpen,
  } = useContext(LayoutContext);
  const { data: currentMember } = useContext(CurrentUserContext);
  const { data: memberships } = useItemMemberships([itemId]);

  useEffect(() => {
    setEditingItemId(null);
    setIsItemSettingsOpen(false);
    setIsItemSharingOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!itemId || !item || isError) {
    return <ErrorAlert />;
  }

  const itemMembership = getHighestPermissionForMemberFromMemberships({
    memberships: getMembership(memberships),
    memberId: currentMember?.get('id'),
  });
  const permission = itemMembership?.permission;
  const enableEdition = PERMISSIONS_EDITION_ALLOWED.includes(permission);

  const content = (() => {
    if (enableEdition && isItemSettingsOpen) {
      return <ItemSettings item={item} />;
    }
    if (isItemSharingOpen) {
      return (
        <ItemSharingTab item={item} memberships={getMembership(memberships)} />
      );
    }
    if (isDashboardOpen) {
      return <GraaspAnalyzer item={item} />;
    }
    return <ItemContent item={item} enableEdition={enableEdition} />;
  })();

  return (
    <Main>
      <UppyContextProvider enable={enableEdition} itemId={itemId}>
        <FileUploader />
        <ItemMain item={item}>{content}</ItemMain>
      </UppyContextProvider>
    </Main>
  );
};

const WrappedItemScreen = () => {
  const { mutate: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { mutate: itemLoginSignIn } = useMutation(
    MUTATION_KEYS.POST_ITEM_LOGIN,
  );
  const { itemId } = useParams();

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    signOut,
    itemId,
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

export default WrappedItemScreen;
