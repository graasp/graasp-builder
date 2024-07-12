import { Drawer, Toolbar, styled } from '@mui/material';

import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_PANEL_ID } from '../../config/selectors';

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? RIGHT_MENU_WIDTH : 0,
  flexShrink: 0,
  // todo: move this to the UI theme.
  '.MuiDrawer-paper': {
    padding: theme.spacing(0, 1),
    boxSizing: 'border-box',
    width: RIGHT_MENU_WIDTH,
  },
}));

type Props = { open: boolean; children: JSX.Element | JSX.Element[] };

const ItemPanel = ({ open, children }: Props): JSX.Element => (
  <StyledDrawer
    id={ITEM_PANEL_ID}
    anchor="right"
    variant="persistent"
    open={open}
  >
    <Toolbar />
    {children}
  </StyledDrawer>
);

export default ItemPanel;
