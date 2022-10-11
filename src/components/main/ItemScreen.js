import { useContext, useEffect } from 'react';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemLoginAuthorization } from '@graasp/ui';

import {
  ITEM_ACTION_TABS,
  PERMISSIONS_EDITION_ALLOWED,
} from '../../config/constants';
import { hooks, useMutation } from '../../config/queryClient';
import {
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
  ITEM_LOGIN_SIGN_IN_MODE_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { getHighestPermissionForMemberFromMemberships } from '../../utils/membership';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { LayoutContext } from '../context/LayoutContext';
import FileUploader from '../file/FileUploader';
import { UppyContextProvider } from '../file/UppyContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemPublishTab from '../item/publish/ItemPublishTab';
import ItemSettings from '../item/settings/ItemSettings';
import ItemSharingTab from '../item/sharing/ItemSharingTab';
import GraaspAnalyzer from './GraaspAnalyzer';
import ItemForbiddenScreen from './ItemForbiddenScreen';
import Main from './Main';

const { useItem, useCurrentMember, useItemLogin, useItemMemberships } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isError } = useItem(itemId);

  const { setEditingItemId, openedActionTabId } = useContext(LayoutContext);
  const { data: currentMember } = useContext(CurrentUserContext);
  const { data: memberships } = useItemMemberships(itemId);

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!itemId || !item || isError) {
    return <ErrorAlert />;
  }

  const itemMembership = getHighestPermissionForMemberFromMemberships({
    memberships: memberships?.toJS(),
    memberId: currentMember?.id,
  });
  const permission = itemMembership?.permission;
  const enableEditing = PERMISSIONS_EDITION_ALLOWED.includes(permission);

  const content = (() => {
    if (openedActionTabId === ITEM_ACTION_TABS.SETTINGS && enableEditing) {
      return <ItemSettings item={item} />;
    }

    switch (openedActionTabId) {
      case ITEM_ACTION_TABS.SHARING: {
        return <ItemSharingTab item={item} memberships={memberships} />;
      }
      case ITEM_ACTION_TABS.DASHBOARD: {
        return <GraaspAnalyzer item={item} />;
      }
      case ITEM_ACTION_TABS.LIBRARY: {
        return <ItemPublishTab item={item} permission={permission} />;
      }
      default:
        return (
          <ItemContent
            item={item}
            enableEditing={enableEditing}
            permission={permission}
          />
        );
    }
  })();

  return (
    <Main>
      <UppyContextProvider enable={enableEditing} itemId={itemId}>
        {item.type === ITEM_TYPES.FOLDER && <FileUploader />}
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

  const ForbiddenContent = <ItemForbiddenScreen />;

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    signOut,
    itemId,
    useCurrentMember,
    useItem,
    useItemLogin,
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
