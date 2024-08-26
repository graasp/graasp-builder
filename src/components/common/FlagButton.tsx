import { useContext } from 'react';

import { ListItemIcon, MenuItem } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { FlagIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_MENU_FLAG_BUTTON_CLASS } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { FlagItemModalContext } from '../context/FlagItemModalContext';

const FlagButton = ({ item }: { item: PackedItem }): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { openModal: openFlagModal } = useContext(FlagItemModalContext);
  const handleFlag = () => {
    openFlagModal?.(item.id);
  };

  return (
    <MenuItem onClick={handleFlag} className={ITEM_MENU_FLAG_BUTTON_CLASS}>
      <ListItemIcon>
        <FlagIcon />
      </ListItemIcon>
      {translateBuilder(BUILDER.ITEM_MENU_FLAG_MENU_ITEM)}
    </MenuItem>
  );
};

export default FlagButton;
