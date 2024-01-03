import Stack from '@mui/material/Stack';

import { useMobileView } from '@graasp/ui';

import { ITEM_HEADER_ID } from '../../../config/selectors';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';
import MobileItemHeaderActions from './MobileItemHeaderActions';

type Props = {
  showNavigation?: boolean;
};

const ItemHeader = ({ showNavigation = true }: Props): JSX.Element => {
  const { isMobile } = useMobileView();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={1}
      // mt={2}
      id={ITEM_HEADER_ID}
    >
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      {isMobile ? <MobileItemHeaderActions /> : <ItemHeaderActions />}
    </Stack>
  );
};

export default ItemHeader;
