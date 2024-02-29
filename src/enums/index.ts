import ItemLayoutMode from './itemLayoutMode';
import Ordering from './orderingTypes';

enum TreePreventSelection {
  NONE = 'none',
  SELF_AND_CHILDREN = 'selfAndChildren',
}

enum ButtonVariants {
  IconButton = 'icon',
  Button = 'button',
}

export { Ordering, TreePreventSelection, ButtonVariants, ItemLayoutMode };
