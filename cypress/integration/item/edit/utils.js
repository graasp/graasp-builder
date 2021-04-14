import {
  DEFAULT_ITEM_LAYOUT_MODE,
  ITEM_TYPES,
  ITEM_LAYOUT_MODES,
} from '../../../../src/config/constants';
import {
  buildItemCard,
  buildItemsTableRowId,
  EDIT_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';

// eslint-disable-next-line import/prefer-default-export
export const editItem = (payload, mode = DEFAULT_ITEM_LAYOUT_MODE) => {
  const { id, type } = payload;
  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID: {
      const button = `#${buildItemCard(id)} .${EDIT_ITEM_BUTTON_CLASS}`;
      cy.get(button).click();
      break;
    }
    case ITEM_LAYOUT_MODES.LIST:
    default: {
      cy.get(`#${buildItemsTableRowId(id)} .${EDIT_ITEM_BUTTON_CLASS}`).click();
    }
  }

  switch (type) {
    case ITEM_TYPES.FILE:
    case ITEM_TYPES.S3_FILE:
    case ITEM_TYPES.LINK:
      cy.fillBaseItemModal(payload);
      break;
    case ITEM_TYPES.SPACE:
    default:
      cy.fillSpaceModal(payload);
  }
};
