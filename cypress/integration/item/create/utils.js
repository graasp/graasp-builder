import { ITEM_TYPES } from '../../../../src/config/constants';
import {
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_CLOSE_BUTTON_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_LINK_ID,
  DASHBOARD_UPLOADER_ID,
} from '../../../../src/config/selectors';

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
      const file = [payload?.filepath || payload?.extra?.s3FileItem?.key];
      cy.get(`#${CREATE_ITEM_FILE_ID}`).click();

      // drag-drop a file in the uploader
      cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).attachFile(
        file,
        {
          subjectType: 'drag-n-drop',
        },
      );
      if (confirm) {
        cy.get(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
      }
      break;
    }
    case ITEM_TYPES.SPACE:
    default:
      cy.fillSpaceModal(payload, options);
      break;
  }
};
