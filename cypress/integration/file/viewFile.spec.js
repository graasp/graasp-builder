import { DEFAULT_MODE, MIME_TYPES, MODES } from '../../../src/config/constants';
import { HOME_PATH } from '../../../src/config/paths';
import {
  buildFileImageId,
  buildFilePdfId,
  buildFileVideoId,
  buildItemsTableRowId,
  ITEM_PANEL_DESCRIPTION_ID,
  ITEM_PANEL_ID,
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
} from '../../../src/config/selectors';
import {
  IMAGE_ITEM_DEFAULT,
  IMAGE_ITEM_S3,
  PDF_ITEM_DEFAULT,
  PDF_ITEM_S3,
  VIDEO_ITEM_DEFAULT,
  VIDEO_ITEM_S3,
} from '../../fixtures/files';

const expectFileViewScreenLayout = ({
  id,
  name,
  extra,
  creator,
  description,
}) => {
  const mimetype = extra?.fileItem?.mimetype || extra?.s3FileItem?.contenttype;

  // embedded element
  let selector = null;
  if (MIME_TYPES.IMAGE.includes(mimetype)) {
    selector = `#${buildFileImageId(id)}`;
  } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
    selector = `#${buildFileVideoId(id)}`;
  } else if (MIME_TYPES.PDF.includes(mimetype)) {
    selector = `#${buildFilePdfId(id)}`;
  }
  cy.get(selector).should('exist');

  // table
  const panel = cy.get(`#${ITEM_PANEL_ID}`);
  panel.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
  panel.get(`#${ITEM_PANEL_DESCRIPTION_ID}`).contains(description);
  panel.get(`#${ITEM_PANEL_TABLE_ID}`).should('exist').contains(creator);
  panel.get(`#${ITEM_PANEL_TABLE_ID}`).contains(mimetype);
  panel
    .get(`#${ITEM_PANEL_TABLE_ID}`)
    .contains(extra?.fileItem?.size || extra?.s3FileItem?.size);
};

describe('File Screen', () => {
  describe('Default server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_DEFAULT, PDF_ITEM_DEFAULT],
      });
      cy.visit(HOME_PATH);
      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }
    });
    it('image', () => {
      // item is display in table
      cy.get(`#${buildItemsTableRowId(IMAGE_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(IMAGE_ITEM_DEFAULT.id);
      expectFileViewScreenLayout(IMAGE_ITEM_DEFAULT);
    });

    it('video', () => {
      // item is display in table
      cy.get(`#${buildItemsTableRowId(VIDEO_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(VIDEO_ITEM_DEFAULT.id);
      expectFileViewScreenLayout(VIDEO_ITEM_DEFAULT);
    });

    it('pdf', () => {
      // item is display in table
      cy.get(`#${buildItemsTableRowId(PDF_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(PDF_ITEM_DEFAULT.id);
      expectFileViewScreenLayout(PDF_ITEM_DEFAULT);
    });
  });

  describe('S3 server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_S3, VIDEO_ITEM_S3, PDF_ITEM_S3],
      });
      cy.visit(HOME_PATH);
      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }
    });
    it('image', () => {
      // item is display in table
      cy.get(`#${buildItemsTableRowId(IMAGE_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(IMAGE_ITEM_S3.id);
      expectFileViewScreenLayout(IMAGE_ITEM_S3);
    });

    it('video', () => {
      // item is display in table
      cy.get(`#${buildItemsTableRowId(VIDEO_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(VIDEO_ITEM_S3.id);
      expectFileViewScreenLayout(VIDEO_ITEM_S3);
    });

    it('pdf', () => {
      // item is display in table
      cy.get(`#${buildItemsTableRowId(PDF_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(PDF_ITEM_S3.id);
      expectFileViewScreenLayout(PDF_ITEM_S3);
    });
  });
});
