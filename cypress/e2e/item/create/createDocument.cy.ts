import { ITEM_FORM_CONFIRM_BUTTON_ID } from '@/config/selectors';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import {
  GRAASP_DOCUMENT_BLANK_NAME_ITEM,
  GRAASP_DOCUMENT_ITEM,
} from '../../../fixtures/documents';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { createDocument } from '../../../support/createUtils';

describe('Create Document', () => {
  it('create document on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // create
    createDocument(GRAASP_DOCUMENT_ITEM);

    cy.wait('@postItem').then(() => {
      // should update view
      cy.wait('@getAccessibleItems');
    });
  });

  it('create document in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // create
    createDocument(GRAASP_DOCUMENT_ITEM);

    cy.wait('@postItem').then(() => {
      // expect update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  it('cannot create Document with blank name', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    createDocument(GRAASP_DOCUMENT_BLANK_NAME_ITEM, { confirm: false });

    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
      'have.prop',
      'disabled',
      true,
    );
  });
});
