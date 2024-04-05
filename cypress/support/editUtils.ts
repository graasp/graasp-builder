import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '@/enums/itemLayoutMode';

import {
  EDIT_MODAL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
} from '../../src/config/selectors';
import { ItemLayoutMode } from '../../src/enums';
import { CAPTION_EDIT_PAUSE } from './constants';

// eslint-disable-next-line import/prefer-default-export
// bug: use string for type to fit usage
export const editItem = (
  payload: {
    id: string;
    type: DiscriminatedItem['type'] | string;
    name: string;
    displayName: string;
    description: string;
  },
  mode = DEFAULT_ITEM_LAYOUT_MODE,
): void => {
  const { id, type } = payload;
  switch (mode) {
    case ItemLayoutMode.Grid: {
      const button = `#${buildEditButtonId(id)}`;
      cy.get(button).click();
      break;
    }
    case ItemLayoutMode.List:
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
