import { buildItemPath } from '../../../../src/config/paths';
import {
  CROP_MODAL_CONFIRM_BUTTON_CLASSNAME,
  ITEM_SETTINGS_BUTTON_CLASS,
  THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME,
} from '../../../../src/config/selectors';
import {
  SAMPLE_ITEMS_WITH_THUMBNAILS,
  THUMBNAIL_MEDIUM_PATH,
} from '../../../fixtures/thumbnails';
import { FILE_LOADING_PAUSE } from '../../../support/constants';

describe('Upload Thumbnails', () => {
  beforeEach(() => {
    cy.setUpApi(SAMPLE_ITEMS_WITH_THUMBNAILS);
  });

  it(`upload item thumbnail`, () => {
    const { items } = SAMPLE_ITEMS_WITH_THUMBNAILS;
    cy.visit(buildItemPath(items[0].id));
    cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

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
