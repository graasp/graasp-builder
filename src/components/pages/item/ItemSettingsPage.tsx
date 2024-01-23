import { Navigate, useOutletContext, useParams } from 'react-router';

import { PERMISSIONS_EDITION_ALLOWED } from '@/config/constants';
import { buildItemPath } from '@/config/paths';

import ItemSettings from '../../item/settings/ItemSettings';
import { OutletType } from './type';

const ItemSettingsPage = (): JSX.Element => {
  const { itemId } = useParams();
  const { permission } = useOutletContext<OutletType>();

  const enableEditing = permission
    ? PERMISSIONS_EDITION_ALLOWED.includes(permission)
    : false;

  if (enableEditing) {
    return <ItemSettings />;
  }
  // redirect the user to the item if he doesn't have the permission to access this page
  return <Navigate to={buildItemPath(itemId)} replace />;
};

export default ItemSettingsPage;
