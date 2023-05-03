import { AppItemType, DocumentItemType, EmbeddedLinkItemType, ItemType } from '@graasp/sdk';

import {
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_CLOSE_BUTTON_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_ZIP_ID,
  DASHBOARD_UPLOADER_ID,
  ZIP_DASHBOARD_UPLOADER_ID,
} from '../../src/config/selectors';
import { InternalItemType } from '../../src/config/types';
import { FileItemForTest } from './types';

export const createApp = (payload: AppItemType, options?: { confirm?: boolean }): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.get(`#${CREATE_ITEM_APP_ID}`).click();
  cy.fillAppModal(payload, options);
};

export const createDocument = (payload: DocumentItemType, options?: { confirm?: boolean }): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.get(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
  cy.fillDocumentModal(payload, options);
};

export const createFolder = (payload: { name?: string; description?: string }, options?: { confirm?: boolean }): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.fillFolderModal(payload, options);
};

export const createLink = (payload: EmbeddedLinkItemType, options?: { confirm?: boolean }): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.get(`#${CREATE_ITEM_LINK_ID}`).click();
  cy.fillLinkModal(payload, options);
};

export const createFile = (payload: FileItemForTest, options?: { confirm?: boolean }): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  const { confirm = true } = options ?? {};
  cy.get(`#${CREATE_ITEM_FILE_ID}`).click();

  // drag-drop a file in the uploader
  cy.attachFile(
    cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
    payload?.createFilepath,
    {
      action: 'drag-drop',
      force: true,
    },
  );
  if (confirm) {
    cy.get(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
  }
};


export const createItem = (payload: { name?: string; extra?: { [ItemType.LINK]: { url?: string; } }; filepath?: string; type?: ItemType | InternalItemType, createFilepath?: string }, options?: { confirm?: boolean }): void => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();

  switch (payload.type) {
    case ItemType.LINK:
      cy.get(`#${CREATE_ITEM_LINK_ID}`).click();
      cy.fillLinkModal(payload, options);
      break;
    case ItemType.S3_FILE:
    case ItemType.LOCAL_FILE: {
      const { confirm = true } = options;
      cy.get(`#${CREATE_ITEM_FILE_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(
        cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
        payload?.createFilepath,
        {
          action: 'drag-drop',
          force: true,
        },
      );
      if (confirm) {
        cy.get(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
      }
      break;
    }
    case InternalItemType.ZIP: {
      cy.get(`#${CREATE_ITEM_ZIP_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(
        cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
        payload?.filepath,
        {
          action: 'drag-drop',
          force: true,
        },
      );
      break;
    }
    case ItemType.DOCUMENT:
      cy.get(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
      cy.fillDocumentModal(payload, options);
      break;
    case ItemType.APP:
      cy.get(`#${CREATE_ITEM_APP_ID}`).click();
      cy.fillAppModal(payload, options);
      break;
    case ItemType.FOLDER:
    default:
      cy.fillFolderModal(payload, options);
      break;
  }
};
