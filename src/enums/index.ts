import ChatStatus from './chatbox';
import Ordering from './orderingTypes';

enum TreePreventSelection {
  NONE = 'none',
  SELF_AND_CHILDREN = 'selfAndChildren',
}

enum ITEM_LAYOUT_MODES {
  GRID = 'grid',
  LIST = 'list',
}

enum ItemActionTabs {
  Settings = 'settings',
  Dashboard = 'dashboard',
  Library = 'library',
  Sharing = 'sharing',
}

enum ButtonVariants {
  IconButton = 'icon',
  Button = 'button',
}

export {
  ITEM_LAYOUT_MODES,
  Ordering,
  ItemActionTabs,
  TreePreventSelection,
  ChatStatus,
  ButtonVariants,
};
