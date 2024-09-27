import { PackedFolderItemFactory, PackedItem } from '@graasp/sdk';

import { buildItemSettingsPath } from '../../../../src/config/paths';
import {
  CROP_MODAL_CONFIRM_BUTTON_ID,
  IMAGE_THUMBNAIL_UPLOADER,
  REMOVE_THUMBNAIL_BUTTON,
  buildDataCyWrapper,
} from '../../../../src/config/selectors';
import {
  ITEM_THUMBNAIL_LINK,
  THUMBNAIL_MEDIUM_PATH,
} from '../../../fixtures/thumbnails/links';
import { FILE_LOADING_PAUSE } from '../../../support/constants';

describe('Item Thumbnail', () => {
  const item = PackedFolderItemFactory();
  const itemWithThumbnails: PackedItem = {
    ...PackedFolderItemFactory(),
    thumbnails: { small: ITEM_THUMBNAIL_LINK, medium: ITEM_THUMBNAIL_LINK },
    settings: { hasThumbnail: true },
  };
  beforeEach(() => {
    cy.setUpApi({
      items: [item, itemWithThumbnails],
    });
  });
  describe('Upload Thumbnails', () => {
    it(`upload item thumbnail`, () => {
      cy.visit(buildItemSettingsPath(item.id));

      // change item thumbnail
      // target visually hidden input
      cy.get(buildDataCyWrapper(IMAGE_THUMBNAIL_UPLOADER)).selectFile(
        THUMBNAIL_MEDIUM_PATH,
        // use force because the input is visually hidden
        { force: true },
      );
      cy.wait(FILE_LOADING_PAUSE);
      cy.get(`#${CROP_MODAL_CONFIRM_BUTTON_ID}`).click();
      cy.wait(`@uploadItemThumbnail`);
    });
  });

  describe('Delete thumbnail', () => {
    it('Delete thumbnail button should exist for item with thumbnail', () => {
      cy.visit(buildItemSettingsPath(itemWithThumbnails.id));

      cy.get(buildDataCyWrapper(REMOVE_THUMBNAIL_BUTTON))
        .invoke('show')
        .should('be.visible')
        .click();
      cy.wait(`@deleteItemThumbnail`).then(({ request: { url } }) => {
        expect(url).to.contain(itemWithThumbnails.id);
      });
    });

    it('Delete thumbnail button should not exist for item with no thumbnail', () => {
      cy.visit(buildItemSettingsPath(item.id));
      Cypress.on('fail', (error) => {
        expect(error.message).to.include(
          `Expected to find element: \`${buildDataCyWrapper(REMOVE_THUMBNAIL_BUTTON)}\`, but never found it.`,
        );
        return false; // Prevent Cypress from failing the test
      });
      // this will throw an error as ITEM_THUMBNAIL_DELETE_BTN_ID not exist that going to be catches at cypress.on fail
      cy.get(`${buildDataCyWrapper(REMOVE_THUMBNAIL_BUTTON)}`).invoke('show');
    });
  });
});
