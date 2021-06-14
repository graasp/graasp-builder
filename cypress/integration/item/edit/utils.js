import { ITEM_TYPES, ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import {
  buildItemCard,
  buildItemsTableRowId,
  EDIT_ITEM_BUTTON_CLASS,
  TEXT_EDITOR_CLASS,
  VIEW_ITEM_EDIT_ITEM_BUTTON_ID,
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
    case ITEM_TYPES.SHORTCUT:
    case ITEM_TYPES.APP:
      cy.fillBaseItemModal(payload);
      break;
    case ITEM_TYPES.DOCUMENT:
      cy.fillDocumentModal(payload);
      break;
    case ITEM_TYPES.FOLDER:
    default:
      cy.fillSpaceModal(payload);
  }
};

export const editCaptionFromViewPage = ({ caption }) => {
  cy.get(`#${VIEW_ITEM_EDIT_ITEM_BUTTON_ID}`).click();
  cy.get(`.${TEXT_EDITOR_CLASS}`).clear().type(caption).blur();
};
