import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ZIP_DASHBOARD_UPLOADER_ID } from '../../../../src/config/selectors';
import { ZIP_DEFAULT } from '../../../fixtures/files';
import { createItem } from '../../../support/createUtils';

describe('Import Zip', () => {
  it('import zip on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    // create
    createItem(ZIP_DEFAULT);

    // check interface didn't crash
    cy.wait(5000);
    cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });

  it('create file in item', () => {
    const FOLDER = PackedFolderItemFactory();

    cy.setUpApi({ items: [FOLDER] });
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    // create
    createItem(ZIP_DEFAULT);

    // check interface didn't crash
    cy.wait(5000);
    cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });

  it('catch error', () => {
    const FOLDER = PackedFolderItemFactory();

    cy.setUpApi({ items: [FOLDER], importZipError: true });
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    // create
    createItem(ZIP_DEFAULT);

    // check interface didn't crash
    cy.wait(5000);
    cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });
});
