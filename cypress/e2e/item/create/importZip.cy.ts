import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ZIP_DASHBOARD_UPLOADER_ID } from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import { ZIP_DEFAULT } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { createItem } from '../../../support/createUtils';

describe('Import Zip', () => {
  it('import zip on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // create
    createItem(ZIP_DEFAULT);

    // check interface didn't crash
    cy.wait(5000);
    cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });

  it('create file in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    cy.switchMode(ItemLayoutMode.List);

    // create
    createItem(ZIP_DEFAULT);

    // check interface didn't crash
    cy.wait(5000);
    cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });

  it('catch error', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, importZipError: true });
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    cy.switchMode(ItemLayoutMode.List);

    // create
    createItem(ZIP_DEFAULT);

    // check interface didn't crash
    cy.wait(5000);
    cy.get(`#${ZIP_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });
});
