import ITEM_DATA_TYPES from './itemDataTypes';
import MIME_TYPES from './mimeTypes';
import ORDERING from './orderingTypes';

export enum TreePreventSelection {
  NONE = 'none',
  SELF_AND_CHILDREN = 'selfAndChildren',
}

export enum ITEM_LAYOUT_MODES {
  GRID = 'grid',
  LIST = 'list',
}

export { ITEM_DATA_TYPES, MIME_TYPES, ORDERING };
