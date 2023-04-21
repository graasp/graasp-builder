import { ItemType } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '../../src/config/constants';
import {
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
  buildSaveButtonId,
} from '../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../src/enums';
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
    case ItemType.FILE:
    case ItemType.S3_FILE:
    case ItemType.LINK:
    case ItemType.SHORTCUT:
    case ItemType.APP:
      cy.fillBaseItemModal(payload);
      break;
    case ItemType.DOCUMENT:
      cy.fillDocumentModal(payload);
      break;
    case ItemType.FOLDER:
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
