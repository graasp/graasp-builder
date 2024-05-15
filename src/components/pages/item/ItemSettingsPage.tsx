import {
  Navigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

import ItemSettings from '../../item/settings/ItemSettings';
import { OutletType } from './type';

const ItemSettingsPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const { itemId } = useParams();
  const { permission } = useOutletContext<OutletType>();

  const enableEditing = permission
    ? PermissionLevelCompare.gte(permission, PermissionLevel.Write)
    : false;

  if (enableEditing) {
    return <ItemSettings />;
  }
  // redirect the user to the item if he doesn't have the permission to access this page
  return (
    <Navigate
      to={{ pathname: buildItemPath(itemId), search: searchParams.toString() }}
      replace
    />
  );
};

export default ItemSettingsPage;
