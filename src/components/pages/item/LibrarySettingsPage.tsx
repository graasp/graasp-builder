import {
  Navigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { PermissionLevel } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

import ItemPublishTab from '../../item/publish/ItemPublishTab';
import { OutletType } from './type';

const LibrarySettingsPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const { itemId } = useParams();
  const { permission } = useOutletContext<OutletType>();

  const isAdmin = permission === PermissionLevel.Admin;

  if (isAdmin) {
    return <ItemPublishTab />;
  }

  // redirect the user to the item if he doesn't have the permission to access this page
  return (
    <Navigate
      to={{ pathname: buildItemPath(itemId), search: searchParams.toString() }}
      replace
    />
  );
};

export default LibrarySettingsPage;
