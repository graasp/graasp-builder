import Stack from '@mui/material/Stack';

import { ITEM_HEADER_ID } from '../../../config/selectors';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';

type Props = {
  showNavigation?: boolean;
};

const ItemHeader = ({ showNavigation = true }: Props): JSX.Element | null => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    mb={1}
    id={ITEM_HEADER_ID}
  >
    {/* display empty div to render actions on the right */}
    {showNavigation ? <Navigation /> : <div />}
    <ItemHeaderActions />
  </Stack>
);

export default ItemHeader;
