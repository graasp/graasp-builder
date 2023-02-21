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
import { ITEM_TYPES } from '../fixtures/enums';

// eslint-disable-next-line import/prefer-default-export
export const createItem = (payload, options) => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();

  switch (payload.type) {
    case ITEM_TYPES.LINK:
      cy.get(`#${CREATE_ITEM_LINK_ID}`).click();
      cy.fillLinkModal(payload, options);
      break;
    case ITEM_TYPES.S3_FILE:
    case ITEM_TYPES.FILE: {
      const { confirm = true } = options;
      const file = [payload?.createFilepath];
      cy.get(`#${CREATE_ITEM_FILE_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(
        cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
        file,
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
    case ITEM_TYPES.ZIP: {
      const file = [payload?.filepath];
      cy.get(`#${CREATE_ITEM_ZIP_ID}`).click();

      // drag-drop a file in the uploader
      cy.attachFile(
        cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
        file,
        {
          action: 'drag-drop',
          force: true,
        },
      );
      break;
    }
    case ITEM_TYPES.DOCUMENT:
      cy.get(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
      cy.fillDocumentModal(payload, options);
      break;
    case ITEM_TYPES.APP:
      cy.get(`#${CREATE_ITEM_APP_ID}`).click();
      cy.fillAppModal(payload, options);
      break;
    case ITEM_TYPES.FOLDER:
    default:
      cy.fillFolderModal(payload, options);
      break;
  }
};
