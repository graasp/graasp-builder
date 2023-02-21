import { DEFAULT_ITEM_LAYOUT_MODE } from '../../src/config/constants';
import {
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
  buildSaveButtonId,
} from '../../src/config/selectors';
import { ITEM_LAYOUT_MODES, ITEM_TYPES } from '../fixtures/enums';
import { CAPTION_EDIT_PAUSE, TABLE_ITEM_RENDER_TIME } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const editItem = (payload, mode = DEFAULT_ITEM_LAYOUT_MODE) => {
  if (DEFAULT_ITEM_LAYOUT_MODE === ITEM_LAYOUT_MODES.LIST) {
    cy.wait(TABLE_ITEM_RENDER_TIME);
  }
  const { id, type } = payload;
  switch (mode) {
    case ITEM_LAYOUT_MODES.GRID: {
      const button = `#${buildEditButtonId(id)}`;
      cy.get(button).click();
      break;
    }
    case ITEM_LAYOUT_MODES.LIST:
    default: {
      cy.get(`#${buildEditButtonId(id)}`).click();
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
      cy.fillFolderModal(payload);
  }
};

export const editCaptionFromViewPage = ({ id, caption }) => {
  cy.wait(CAPTION_EDIT_PAUSE);
  cy.get(`#${buildEditButtonId(id)}`).click();
  cy.get(`.${TEXT_EDITOR_CLASS}`).type(`{selectall}${caption}`);
  cy.get(`#${buildSaveButtonId(id)}`).click();
};
