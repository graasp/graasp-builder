import { Link } from 'react-router-dom';

import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Tooltip } from '@mui/material';

import { buildItemInformationPath } from '@/config/paths';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_INFORMATION_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

const ItemMetadataButton = ({ itemId }: { itemId: string }): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Tooltip title={translateBuilder(BUILDER.ITEM_METADATA_TITLE)}>
      <IconButton
        component={Link}
        to={buildItemInformationPath(itemId)}
        id={ITEM_INFORMATION_BUTTON_ID}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ItemMetadataButton;
