import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { GRAASP_DOCUMENT_ITEM } from '../../../fixtures/documents';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from '../../../support/createUtils';

describe('Create Document', () => {
  it('create document on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(GRAASP_DOCUMENT_ITEM, ITEM_LAYOUT_MODES.LIST);

    cy.wait('@postItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);
      // should update view
      cy.wait('@getOwnItems');
    });
  });

  it('create document in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(GRAASP_DOCUMENT_ITEM, ITEM_LAYOUT_MODES.LIST);

    cy.wait('@postItem').then(() => {
      // expect update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });
});
