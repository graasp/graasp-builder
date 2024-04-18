import { buildItemSettingsPath } from '../../../../src/config/paths';
import {
  CROP_MODAL_CONFIRM_BUTTON_CLASSNAME,
  ITEM_THUMBNAIL_CONTAINER_ID,
  ITEM_THUMBNAIL_DELETE_BTN_ID,
  THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import {
  SAMPLE_ITEMS_WITH_THUMBNAILS,
  THUMBNAIL_MEDIUM_PATH,
} from '../../../fixtures/thumbnails';
import { FILE_LOADING_PAUSE } from '../../../support/constants';

describe('Item Thumbnail', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [...SAMPLE_ITEMS_WITH_THUMBNAILS.items, SAMPLE_ITEMS.items[4]],
    });
  });
  describe('Upload Thumbnails', () => {
    it(`upload item thumbnail`, () => {
      const { items } = SAMPLE_ITEMS_WITH_THUMBNAILS;
      cy.visit(buildItemSettingsPath(items[0].id));

      // change item thumbnail
      // selectFile ???
      cy.attachFile(
        cy.get(`.${THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME}`),
        THUMBNAIL_MEDIUM_PATH,
      );
      cy.wait(FILE_LOADING_PAUSE);
      cy.get(`.${CROP_MODAL_CONFIRM_BUTTON_CLASSNAME}`).click();
      cy.wait(`@uploadItemThumbnail`);
    });
  });

  describe('Delete thumbnail', () => {
    it('Delete thumbnail button should exist for item with thumbnail', () => {
      const { items } = SAMPLE_ITEMS_WITH_THUMBNAILS;
      cy.visit(buildItemSettingsPath(items[1].id));

      cy.get(`#${ITEM_THUMBNAIL_CONTAINER_ID}`).trigger('mouseover');
      cy.get(`#${ITEM_THUMBNAIL_DELETE_BTN_ID}`).should('be.visible');
      cy.get(`#${ITEM_THUMBNAIL_DELETE_BTN_ID}`).click();
      cy.wait(`@deleteItemThumbnail`);
    });

    it('Delete thumbnail button should not exist for item with no thumbnail', () => {
      cy.visit(buildItemSettingsPath(SAMPLE_ITEMS.items[4].id));
      cy.get(`#${ITEM_THUMBNAIL_CONTAINER_ID}`).trigger('mouseover');
      cy.get(`#${ITEM_THUMBNAIL_DELETE_BTN_ID}`).should('not.exist');
    });
  });
});
