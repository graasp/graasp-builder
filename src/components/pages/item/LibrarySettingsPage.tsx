import { Navigate, useOutletContext, useParams } from 'react-router';

import { PermissionLevel } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

import ItemPublishTab from '../../item/publish/ItemPublishTab';
import { OutletType } from './type';

const LibrarySettingsPage = (): JSX.Element => {
  const { itemId } = useParams();
  const { permission } = useOutletContext<OutletType>();

  const isAdmin = permission === PermissionLevel.Admin;

  if (isAdmin) {
    return <ItemPublishTab />;
  }

  // redirect the user to the item if he doesn't have the permission to access this page
  return <Navigate to={buildItemPath(itemId)} replace />;
};

export default LibrarySettingsPage;
