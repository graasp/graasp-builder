import { useNavigate } from 'react-router';

import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Tooltip } from '@mui/material';

import { buildItemInformationPath } from '@/config/paths';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_INFORMATION_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

const ItemMetadataButton = ({ itemId }: { itemId: string }): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const navigate = useNavigate();

  const onClick = () => {
    navigate(buildItemInformationPath(itemId));
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.ITEM_METADATA_TITLE)}>
      <span>
        <IconButton id={ITEM_INFORMATION_BUTTON_ID} onClick={onClick}>
          <InfoIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ItemMetadataButton;
