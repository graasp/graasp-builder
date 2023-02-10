import { Toolbar, styled } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_PANEL_ID } from '../../config/selectors';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: RIGHT_MENU_WIDTH,
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
