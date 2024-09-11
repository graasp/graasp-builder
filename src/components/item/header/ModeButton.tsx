import { MouseEvent, useState } from 'react';
import { useMatch } from 'react-router';

import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useButtonColor } from '@graasp/ui';

import { LayoutGridIcon, ListIcon, MapIcon } from 'lucide-react';

import { HOME_PATH, buildItemPath } from '@/config/paths';
import { LAYOUT_MODE_BUTTON_ID } from '@/config/selectors';

import { ItemLayoutMode } from '../../../enums';
import { useLayoutContext } from '../../context/LayoutContext';

const ModeIcon = ({ mode }: { mode: ItemLayoutMode }) => {
  const { color } = useButtonColor('primary');
  switch (mode) {
    case ItemLayoutMode.Map:
      return <MapIcon color={color} />;
    case ItemLayoutMode.Grid:
      return <LayoutGridIcon color={color} />;
    case ItemLayoutMode.List:
    default:
      return <ListIcon color={color} />;
  }
};

const ModeButton = (): JSX.Element | null => {
  const { mode, setMode } = useLayoutContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const isHomePath = useMatch(HOME_PATH);
  const isItemPath = useMatch(buildItemPath());

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (newMode: ItemLayoutMode) => {
    setMode(newMode);
    handleClose();
  };

  // show map only for home and path
  let options = Object.values(ItemLayoutMode);
  if (!isHomePath && !isItemPath) {
    options = options.filter((o) => o !== ItemLayoutMode.Map);
  }

  return (
    <>
      <IconButton id={LAYOUT_MODE_BUTTON_ID} onClick={handleClick}>
        <ModeIcon mode={mode} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((value) => (
          <MenuItem
            key={value}
            onClick={() => handleChange(value)}
            value={value}
          >
            <ModeIcon mode={value} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ModeButton;
