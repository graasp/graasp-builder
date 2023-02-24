import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { buildEditButtonId } from '../../config/selectors';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const EditItemCaptionButton = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { setEditingItemId } = useLayoutContext();

  const onClick = () => {
    setEditingItemId(itemId);
  };

  return (
    <Tooltip title={translateBuilder(BUILDER.EDIT_BUTTON_TOOLTIP)}>
      <span>
        <IconButton
          aria-label="edit"
          onClick={onClick}
          id={buildEditButtonId(itemId)}
        >
          <EditIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default EditItemCaptionButton;
