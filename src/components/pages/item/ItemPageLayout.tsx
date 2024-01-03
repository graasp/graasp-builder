import { useEffect } from 'react';
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router';

import { Box } from '@mui/material';

import BackButton from '@/components/common/BackButton';
import Navigation from '@/components/layout/Navigation';
import { buildItemPath } from '@/config/paths';

import ErrorAlert from '../../common/ErrorAlert';
import { useLayoutContext } from '../../context/LayoutContext';
import WrappedAuthItemScreen from './ItemLoginWrapper';
import { OutletType } from './type';

const ItemPageLayout = (): JSX.Element => {
  const { itemId } = useParams();
  const outletContext = useOutletContext<OutletType>();
  const { setEditingItemId } = useLayoutContext();
  const navigate = useNavigate();

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (outletContext.item) {
    return (
      <Box py={1} px={2}>
        <Box display="flex" alignItems="center">
          <BackButton onClick={() => navigate(buildItemPath(itemId))} />
          <Navigation />
        </Box>
        <Box px={2}>
          <Outlet context={outletContext} />
        </Box>
      </Box>
    );
  }

  return <ErrorAlert />;
};

const WrappedItemScreen = (): JSX.Element =>
  WrappedAuthItemScreen(ItemPageLayout);

export default WrappedItemScreen;
