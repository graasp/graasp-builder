import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import {
  GRAASP_LINK_ITEM,
  GRAASP_LINK_ITEM_NO_PROTOCOL,
  INVALID_LINK_ITEM,
} from '../../../fixtures/links';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createLink } from '../../../support/createUtils';

describe('Create Link', () => {
  it('create link on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // create
    createLink(GRAASP_LINK_ITEM);

    cy.wait('@postItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);

      // expect update
      cy.wait('@getAccessibleItems');
    });
  });

  it('create link without protocol on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // create
    createLink(GRAASP_LINK_ITEM_NO_PROTOCOL);

    cy.wait('@postItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);

      // expect update
      cy.wait('@getAccessibleItems');
    });
  });

  it('create folder in item', () => {
    const FOLDER = PackedFolderItemFactory();

    cy.setUpApi({ items: [FOLDER] });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ItemLayoutMode.List);

    // create
    createLink(GRAASP_LINK_ITEM);

    cy.wait('@postItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);

      // expect update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  describe('Error handling', () => {
    it('cannot add an invalid link', () => {
      const FOLDER = PackedFolderItemFactory();
      cy.setUpApi({ items: [FOLDER] });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ItemLayoutMode.List);

      // create
      createLink(INVALID_LINK_ITEM, {
        confirm: false,
      });

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });
  });
});
