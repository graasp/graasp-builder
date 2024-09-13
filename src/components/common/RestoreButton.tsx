import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

import { Undo2Icon } from 'lucide-react';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { RESTORE_ITEMS_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';

type Props = {
  itemIds: string[];
  color?: IconButtonProps['color'];
  id?: string;
  onClick?: () => void;
};

const RestoreButton = ({
  itemIds,
  color = 'default',
  id,
  onClick: onClickFn,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: restoreItems } = mutations.useRestoreItems();

  const onClick = () => {
    // restore items
    restoreItems(itemIds);
    onClickFn?.();
  };

  const title = translateBuilder(BUILDER.RESTORE_ITEM_BUTTON, {
    count: itemIds.length,
  });

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
          <Undo2Icon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default RestoreButton;
