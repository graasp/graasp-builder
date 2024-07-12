import { HOME_PATH } from '../../../../src/config/paths';
import { buildItemCard } from '../../../../src/config/selectors';
import {
  IMAGE_ITEM_DEFAULT,
  IMAGE_ITEM_S3,
  PDF_ITEM_DEFAULT,
  PDF_ITEM_S3,
  VIDEO_ITEM_DEFAULT,
  VIDEO_ITEM_S3,
} from '../../../fixtures/files';
import { expectFileViewScreenLayout } from '../../../support/viewUtils';

describe('View Files', () => {
  describe('default server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_DEFAULT, PDF_ITEM_DEFAULT],
      });
      cy.visit(HOME_PATH);
    });
    it('image', () => {
      // item is displayed in table
      cy.get(`#${buildItemCard(IMAGE_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInCard(IMAGE_ITEM_DEFAULT.id);
      expectFileViewScreenLayout({ item: IMAGE_ITEM_DEFAULT });
    });

    it('video', () => {
      // item is displayed in table
      cy.get(`#${buildItemCard(VIDEO_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInCard(VIDEO_ITEM_DEFAULT.id);
      expectFileViewScreenLayout({ item: VIDEO_ITEM_DEFAULT });
    });

    it('pdf', () => {
      // item is displayed in table
      cy.get(`#${buildItemCard(PDF_ITEM_DEFAULT.id)}`).should('exist');

      // item metadata
      cy.goToItemInCard(PDF_ITEM_DEFAULT.id);
      expectFileViewScreenLayout({ item: PDF_ITEM_DEFAULT });
    });
  });

  describe('s3 server', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [IMAGE_ITEM_S3, VIDEO_ITEM_S3, PDF_ITEM_S3],
      });
      cy.visit(HOME_PATH);
    });
    it('image', () => {
      // item is displayed in table
      cy.get(`#${buildItemCard(IMAGE_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInCard(IMAGE_ITEM_S3.id);
      expectFileViewScreenLayout({ item: IMAGE_ITEM_S3 });
    });

    it('video', () => {
      // item is displayed in table
      cy.get(`#${buildItemCard(VIDEO_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInCard(VIDEO_ITEM_S3.id);
      expectFileViewScreenLayout({ item: VIDEO_ITEM_S3 });
    });

    it('pdf', () => {
      // item is displayed in table
      cy.get(`#${buildItemCard(PDF_ITEM_S3.id)}`).should('exist');

      // item metadata
      cy.goToItemInCard(PDF_ITEM_S3.id);
      expectFileViewScreenLayout({ item: PDF_ITEM_S3 });
    });
  });
});
