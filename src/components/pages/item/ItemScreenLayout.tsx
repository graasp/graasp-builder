import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { useGetPermissionForItem } from '@/hooks/authorization';

import { hooks } from '../../../config/queryClient';
import ErrorAlert from '../../common/ErrorAlert';
import { useLayoutContext } from '../../context/LayoutContext';
import { UppyContextProvider } from '../../file/UppyContext';
import WrappedAuthItemScreen from './ItemLoginWrapper';

const { useItem, useItemMemberships } = hooks;

const ItemScreenLayout = (): JSX.Element => {
  const { itemId } = useParams();

  const { data: item, isLoading } = useItem(itemId);
  const { setEditingItemId } = useLayoutContext();
  const { data: memberships, isLoading: isLoadingItemMemberships } =
    useItemMemberships(itemId);

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const { data: permission } = useGetPermissionForItem(item);
  const canWrite = permission
    ? PermissionLevelCompare.gte(permission, PermissionLevel.Write)
    : false;

  if (item && itemId && memberships) {
    return (
      <UppyContextProvider enable={canWrite} itemId={itemId}>
        <Outlet context={{ item, permission, canWrite }} />
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
