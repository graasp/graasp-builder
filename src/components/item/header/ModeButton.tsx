import { MouseEvent, useState } from 'react';
import { useMatch } from 'react-router';

import {
  List as ListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import MapIcon from '@mui/icons-material/Map';
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { HOME_PATH, buildItemPath } from '@/config/paths';
import { LAYOUT_MODE_BUTTON_ID } from '@/config/selectors';

import { ItemLayoutMode } from '../../../enums';
import { useLayoutContext } from '../../context/LayoutContext';

const modeToIcon = (mode: ItemLayoutMode) => {
  switch (mode) {
    case ItemLayoutMode.Map:
      return <MapIcon color="primary" />;
    case ItemLayoutMode.Grid:
      return <ViewModuleIcon color="primary" />;
    case ItemLayoutMode.List:
    default:
      return <ListIcon color="primary" />;
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
        {modeToIcon(mode)}
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((value) => (
          <MenuItem
            key={value}
            onClick={() => handleChange(value)}
            value={value}
          >
            {modeToIcon(value)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ModeButton;
