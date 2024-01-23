import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

import { Box } from '@mui/material';

import { Loader } from '@graasp/ui';

import BackButton from '@/components/common/BackButton';
import Navigation from '@/components/layout/Navigation';
import { buildItemPath } from '@/config/paths';

import { PERMISSIONS_EDITION_ALLOWED } from '../../../config/constants';
import { hooks } from '../../../config/queryClient';
import { getHighestPermissionForMemberFromMemberships } from '../../../utils/membership';
import ErrorAlert from '../../common/ErrorAlert';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import { useLayoutContext } from '../../context/LayoutContext';
import { UppyContextProvider } from '../../file/UppyContext';
import WrappedAuthItemScreen from './ItemLoginWrapper';

const { useItem, useItemMemberships } = hooks;

const ItemPageLayout = (): JSX.Element => {
  const { itemId } = useParams();

  const { data: item, isLoading } = useItem(itemId);
  const { setEditingItemId } = useLayoutContext();
  const { data: currentMember } = useCurrentUserContext();
  const { data: memberships, isLoading: isLoadingItemMemberships } =
    useItemMemberships(itemId);
  const navigate = useNavigate();

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const itemMembership = getHighestPermissionForMemberFromMemberships({
    memberships,
    memberId: currentMember?.id,
  });
  const permission = itemMembership?.permission;
  const enableEditing = permission
    ? PERMISSIONS_EDITION_ALLOWED.includes(permission)
    : false;

  if (item && itemId && memberships) {
    return (
      <UppyContextProvider enable={enableEditing} itemId={itemId}>
        <Box py={1} px={2}>
          <Box display="flex" alignItems="center">
            <BackButton onClick={() => navigate(buildItemPath(itemId))} />
            <Navigation />
          </Box>
          <Box px={2}>
            <Outlet context={{ item, permission }} />
          </Box>
        </Box>
      </UppyContextProvider>
    );
  }

  if (isLoading || isLoadingItemMemberships) {
    return <Loader />;
  }
  return <ErrorAlert />;
};

const WrappedItemScreen = (): JSX.Element =>
  WrappedAuthItemScreen(ItemPageLayout);

export default WrappedItemScreen;
