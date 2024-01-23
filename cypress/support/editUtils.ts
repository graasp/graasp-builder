import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '../../src/config/constants';
import {
  EDIT_MODAL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
} from '../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../src/enums';
import { CAPTION_EDIT_PAUSE, WAIT_FOR_ITEM_TABLE_ROW_TIME } from './constants';

// eslint-disable-next-line import/prefer-default-export
// bug: use string for type to fit usage
export const editItem = (
  payload: {
    id: string;
    type: DiscriminatedItem['type'] | string;
    name: string;
    description: string;
  },
  mode = DEFAULT_ITEM_LAYOUT_MODE,
): void => {
  if (DEFAULT_ITEM_LAYOUT_MODE === ITEM_LAYOUT_MODES.LIST) {
    cy.wait(WAIT_FOR_ITEM_TABLE_ROW_TIME);
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
    case ItemType.H5P:
    case ItemType.APP:
    case ItemType.ETHERPAD:
    case ItemType.LINK:
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE:
    case ItemType.SHORTCUT:
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

export const editCaptionFromViewPage = ({
  id,
  caption,
}: {
  id: string;
  caption: string;
}): void => {
  cy.wait(CAPTION_EDIT_PAUSE);
  cy.get(`#${buildEditButtonId(id)}`).click();
  cy.get(`#${EDIT_MODAL_ID} .${TEXT_EDITOR_CLASS}`).type(
    `{selectall}${caption}`,
    { timeout: 100 },
  );
  cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
};
