import { ListItemIcon, MenuItem } from '@mui/material';

import { CableIcon } from 'lucide-react';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_MENU_SHORTCUT_BUTTON_CLASS } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

export type Props = {
  onClick?: () => void;
};

const CreateShortcutButton = ({ onClick }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <MenuItem onClick={onClick} className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}>
      <ListItemIcon>
        <CableIcon />
      </ListItemIcon>
      {translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
    </MenuItem>
  );
};

export default CreateShortcutButton;
