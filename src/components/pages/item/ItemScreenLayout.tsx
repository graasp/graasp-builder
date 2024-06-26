import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { hooks } from '../../../config/queryClient';
import ErrorAlert from '../../common/ErrorAlert';
import { useLayoutContext } from '../../context/LayoutContext';
import WrappedAuthItemScreen from './ItemLoginWrapper';

const { useItem } = hooks;

const ItemScreenLayout = (): JSX.Element => {
  const { itemId } = useParams();

  const { data: item, isLoading } = useItem(itemId);
  const { setEditingItemId } = useLayoutContext();

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
    : false;

  const canAdmin = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin)
    : false;

  if (item && itemId) {
    return (
      <Outlet
        context={{ item, permission: item.permission, canWrite, canAdmin }}
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }
  return <ErrorAlert />;
};

const WrappedItemScreen = (): JSX.Element =>
  WrappedAuthItemScreen(ItemScreenLayout);

export default WrappedItemScreen;
