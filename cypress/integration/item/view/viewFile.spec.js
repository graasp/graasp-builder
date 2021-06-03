import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { HOME_PATH } from '../../../../src/config/paths';
import { buildItemsTableRowId } from '../../../../src/config/selectors';
import {
  IMAGE_ITEM_DEFAULT,
  IMAGE_ITEM_S3,
  PDF_ITEM_DEFAULT,
  PDF_ITEM_S3,
  VIDEO_ITEM_DEFAULT,
  VIDEO_ITEM_S3,
} from '../../../fixtures/files';
import { expectFileViewScreenLayout } from './utils';

describe('Files', () => {
  describe('default server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_DEFAULT, PDF_ITEM_DEFAULT],
      });
      cy.visit(HOME_PATH);
      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }
    });
    it('image', () => {
      // item is displayed in table
      cy.get(`#${buildItemsTableRowId(IMAGE_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(IMAGE_ITEM_DEFAULT.id);
      expectFileViewScreenLayout(IMAGE_ITEM_DEFAULT);
    });

    it('video', () => {
      // item is displayed in table
      cy.get(`#${buildItemsTableRowId(VIDEO_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(VIDEO_ITEM_DEFAULT.id);
      expectFileViewScreenLayout(VIDEO_ITEM_DEFAULT);
    });

    it('pdf', () => {
      // item is displayed in table
      cy.get(`#${buildItemsTableRowId(PDF_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(PDF_ITEM_DEFAULT.id);
      expectFileViewScreenLayout(PDF_ITEM_DEFAULT);
    });
  });

  describe('s3 server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_S3, VIDEO_ITEM_S3, PDF_ITEM_S3],
      });
      cy.visit(HOME_PATH);
      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }
    });
    it('image', () => {
      // item is displayed in table
      cy.get(`#${buildItemsTableRowId(IMAGE_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(IMAGE_ITEM_S3.id);
      expectFileViewScreenLayout(IMAGE_ITEM_S3);
    });

    it('video', () => {
      // item is displayed in table
      cy.get(`#${buildItemsTableRowId(VIDEO_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(VIDEO_ITEM_S3.id);
      expectFileViewScreenLayout(VIDEO_ITEM_S3);
    });

    it('pdf', () => {
      // item is displayed in table
      cy.get(`#${buildItemsTableRowId(PDF_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInList(PDF_ITEM_S3.id);
      expectFileViewScreenLayout(PDF_ITEM_S3);
    });
  });
});
