import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router';

import { Loader } from '@graasp/ui';

import { PERMISSIONS_EDITION_ALLOWED } from '../../../config/constants';
import { hooks } from '../../../config/queryClient';
import { getHighestPermissionForMemberFromMemberships } from '../../../utils/membership';
import ErrorAlert from '../../common/ErrorAlert';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import { useLayoutContext } from '../../context/LayoutContext';
import { UppyContextProvider } from '../../file/UppyContext';
import WrappedAuthItemScreen from './ItemLoginWrapper';

const { useItem, useItemMemberships } = hooks;

const ItemScreenLayout = (): JSX.Element => {
  const { itemId } = useParams();

  const { data: item, isLoading } = useItem(itemId);
  const { setEditingItemId } = useLayoutContext();
  const { data: currentMember } = useCurrentUserContext();
  const { data: memberships, isLoading: isLoadingItemMemberships } =
    useItemMemberships(itemId);

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const itemMembership = getHighestPermissionForMemberFromMemberships({
    memberships,
    memberId: currentMember?.id,
  });
  const permission = itemMembership?.permission;
  const canEdit = permission
    ? PERMISSIONS_EDITION_ALLOWED.includes(permission)
    : false;

  if (item && itemId && memberships) {
    return (
      <UppyContextProvider enable={canEdit} itemId={itemId}>
        <Outlet context={{ item, permission, canEdit }} />
      </UppyContextProvider>
    );
  }

  if (isLoading || isLoadingItemMemberships) {
    return <Loader />;
  }
  return <ErrorAlert />;
};

const WrappedItemScreen = (): JSX.Element =>
  WrappedAuthItemScreen(ItemScreenLayout);

export default WrappedItemScreen;
