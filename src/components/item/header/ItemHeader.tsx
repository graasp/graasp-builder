import { useParams } from 'react-router';

import { Alert, Stack } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { ITEM_HEADER_ID } from '../../../config/selectors';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';

type Props = {
  showNavigation?: boolean;
};

const ItemHeader = ({ showNavigation = true }: Props): JSX.Element | null => {
  const { itemId } = useParams();
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
      id={ITEM_HEADER_ID}
    >
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      {itemId ? (
        <ItemHeaderActions itemId={itemId} />
      ) : (
        <Alert severity="error">
          {translateBuilder(BUILDER.ERROR_MESSAGE)}
        </Alert>
      )}
    </Stack>
  );
};

export default ItemHeader;
