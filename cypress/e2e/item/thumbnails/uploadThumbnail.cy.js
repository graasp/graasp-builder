import {
  buildItemPath,
  MEMBER_PROFILE_PATH,
} from '../../../../src/config/paths';
import {
  ITEM_SETTINGS_BUTTON_CLASS,
  THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME,
  CROP_MODAL_CONFIRM_BUTTON_CLASSNAME,
  MEMBER_PROFILE_AVATAR_UPLOAD_BUTTON_CLASSNAME,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS_WITH_THUMBNAILS } from '../../../fixtures/thumbnails';
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
    cy.fixture('thumbnails/medium', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get(`.${THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME}`).attachFile({
          fileContent,
          fileName: 'testPicture',
        });
        cy.wait(FILE_LOADING_PAUSE);
        cy.get(`.${CROP_MODAL_CONFIRM_BUTTON_CLASSNAME}`).click();
        cy.wait(`@uploadItemThumbnail`);
      });
  });

  it(`upload member avatar`, () => {
    cy.visit(MEMBER_PROFILE_PATH);

    // change item thumbnail
    cy.fixture('thumbnails/medium', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get(`.${MEMBER_PROFILE_AVATAR_UPLOAD_BUTTON_CLASSNAME}`).attachFile({
          fileContent,
          fileName: 'testPicture',
        });
        cy.wait(FILE_LOADING_PAUSE);
        cy.get(`.${CROP_MODAL_CONFIRM_BUTTON_CLASSNAME}`).click();
        cy.wait(`@uploadAvatar`);
      });
  });
});
