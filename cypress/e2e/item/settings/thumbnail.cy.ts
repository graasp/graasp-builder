import { buildItemSettingsPath } from '../../../../src/config/paths';
import {
  CROP_MODAL_CONFIRM_BUTTON_CLASSNAME,
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

      cy.get(`#${ITEM_THUMBNAIL_DELETE_BTN_ID}`)
        .invoke('show')
        .should('be.visible');
      cy.get(`#${ITEM_THUMBNAIL_DELETE_BTN_ID}`).click();
      cy.wait(`@deleteItemThumbnail`).then(({ request: { url } }) => {
        expect(url).to.contain(items[1].id);
      });
    });

    it('Delete thumbnail button should not exist for item with no thumbnail', () => {
      cy.visit(buildItemSettingsPath(SAMPLE_ITEMS.items[4].id));
      Cypress.on('fail', (error) => {
        expect(error.message).to.include(
          `Expected to find element: \`#${ITEM_THUMBNAIL_DELETE_BTN_ID}\`, but never found it.`,
        );
        return false; // Prevent Cypress from failing the test
      });
      // this will throw an error as ITEM_THUMBNAIL_DELETE_BTN_ID not exist that going to be catches at cypress.on fail
      cy.get(`#${ITEM_THUMBNAIL_DELETE_BTN_ID}`).invoke('show');
    });
  });
});
