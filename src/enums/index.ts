import ITEM_LAYOUT_MODES from './itemLayoutModes';
import Ordering from './orderingTypes';

enum TreePreventSelection {
  NONE = 'none',
  SELF_AND_CHILDREN = 'selfAndChildren',
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
  Ordering,
  ItemActionTabs,
  TreePreventSelection,
  ButtonVariants,
  ITEM_LAYOUT_MODES,
};
