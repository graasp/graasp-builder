import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_INFORMATION_ICON_IS_OPEN_CLASS,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { useLayoutContext } from '../context/LayoutContext';

const ItemMetadataButton = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    isItemMetadataMenuOpen,
    setIsItemMetadataMenuOpen,
    setIsChatboxMenuOpen,
  } = useLayoutContext();

  const onClick = () => {
    setIsItemMetadataMenuOpen(!isItemMetadataMenuOpen);
    setIsChatboxMenuOpen(false);
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.ITEM_METADATA_TITLE)}>
      <span>
        <IconButton
          id={ITEM_INFORMATION_BUTTON_ID}
          onClick={onClick}
          className={
            isItemMetadataMenuOpen ? ITEM_INFORMATION_ICON_IS_OPEN_CLASS : ''
          }
        >
          <InfoIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ItemMetadataButton;
