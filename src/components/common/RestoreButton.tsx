import { RestoreFromTrash } from '@mui/icons-material';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { RESTORE_ITEMS_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemIds: string[];
  color?: IconButtonProps['color'];
  id?: string;
};

const RestoreButton = ({
  itemIds,
  color = 'default',
  id,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: restoreItems } = mutations.useRestoreItems();

  const onClick = () => {
    // restore items
    restoreItems(itemIds);
  };

  const title = translateBuilder(BUILDER.RESTORE_ITEM_BUTTON);

  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          id={id}
          aria-label={title}
          color={color}
          className={RESTORE_ITEMS_BUTTON_CLASS}
          onClick={onClick}
        >
          <RestoreFromTrash />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default RestoreButton;
