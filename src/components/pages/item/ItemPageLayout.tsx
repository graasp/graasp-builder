import { useEffect } from 'react';
import {
  Outlet,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Box } from '@mui/material';

import BackButton from '@/components/common/BackButton';
import Navigation from '@/components/layout/Navigation';
import { buildItemPath } from '@/config/paths';

import ErrorAlert from '../../common/ErrorAlert';
import { useLayoutContext } from '../../context/LayoutContext';
import { OutletType } from './type';

const ItemPageLayout = (): JSX.Element => {
  const { itemId } = useParams();
  const [search] = useSearchParams();
  const outletContext = useOutletContext<OutletType>();
  const { setEditingItemId } = useLayoutContext();

  useEffect(() => {
    setEditingItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (outletContext.item) {
    return (
      <Box py={1} px={2}>
        <Box display="flex" alignItems="center">
          <BackButton
            to={{
              pathname: buildItemPath(itemId),
              search: search.toString(),
            }}
          />
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

export default ItemPageLayout;
