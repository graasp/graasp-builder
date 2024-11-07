import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../../../src/config/selectors';
import {
  GRAASP_LINK_ITEM,
  GRAASP_LINK_ITEM_NO_PROTOCOL,
  INVALID_LINK_ITEM,
  LINK_ITEM_WITH_BLANK_NAME,
} from '../../../fixtures/links';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createLink } from '../../../support/createUtils';

describe('Create Link', () => {
  it('create link on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

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

    // create
    createLink(GRAASP_LINK_ITEM_NO_PROTOCOL);

    cy.wait('@postItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);

      // expect update
      cy.wait('@getAccessibleItems');
    });
  });

  it('create link in item', () => {
    const FOLDER = PackedFolderItemFactory();
    const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });

    cy.setUpApi({ items: [FOLDER, CHILD] });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    createLink(GRAASP_LINK_ITEM);

    cy.wait('@postItem').then(({ request: { url } }) => {
      expect(url).to.contain(FOLDER.id);
      // add after child
      expect(url).to.contain(CHILD.id);

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

      // create
      createLink(INVALID_LINK_ITEM);

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });

    it('cannot have an empty name', () => {
      const FOLDER = PackedFolderItemFactory();
      cy.setUpApi({ items: [FOLDER] });
      const { id } = FOLDER;

      // go to children item
      cy.visit(buildItemPath(id));

      // create
      createLink(LINK_ITEM_WITH_BLANK_NAME);

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });
  });
});
