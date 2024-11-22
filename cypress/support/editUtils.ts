import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import {
  EDIT_ITEM_BUTTON_CLASS,
  EDIT_MODAL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
} from '../../src/config/selectors';
import { CAPTION_EDIT_PAUSE } from './constants';

export const editItem = (
  payload: {
    id: string;
    type: DiscriminatedItem['type'] | string;
    name: string;
    description: string;
  },
  container: string = '',
): void => {
  const { type } = payload;
  cy.get(`${container} .${EDIT_ITEM_BUTTON_CLASS}`).click();

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
