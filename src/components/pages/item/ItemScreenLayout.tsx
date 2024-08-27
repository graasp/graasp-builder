import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import {
  PackedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';

import ErrorAlert from '../../common/ErrorAlert';
import { useLayoutContext } from '../../context/LayoutContext';

const ItemScreenLayout = (): JSX.Element => {
  const { item } = useOutletContext<{ item: PackedItem }>();
  const { id: itemId } = item;
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

  return <ErrorAlert />;
};

export default ItemScreenLayout;
