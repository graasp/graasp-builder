import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_LINK_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_LINK_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
} from '../../../../src/config/selectors';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';

const openLinkModal = () => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
  cy.get(`#${CREATE_ITEM_LINK_ID}`).click();
};

const createLink = ({ url }: { url: string }): void => {
  openLinkModal();

  cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`).clear().type(url);
  // wait for iframely to fill fields
  cy.get(`[role=dialog]`).should('contain', 'Page title');
};

describe('Create Link', () => {
  it('create link on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    // create
    createLink({ url: 'https://graasp.org' });
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

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
    createLink({ url: 'graasp.org' });
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

    cy.wait('@postItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);

      // expect update
      cy.wait('@getAccessibleItems');
    });
  });

  it('enter valid link, then reset link', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    // enter valid data
    createLink({ url: 'graasp.org' });
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID} input`).should('not.be.empty');

    // type a wrong link and cannot save
    cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`).clear().type('something');
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID} input`).should('not.be.empty');
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should('be.disabled');
  });

  it('create link in item', () => {
    const FOLDER = PackedFolderItemFactory();
    const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });

    cy.setUpApi({ items: [FOLDER, CHILD] });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    createLink({ url: 'https://graasp.org' });
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

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
      cy.setUpApi();
      cy.visit(HOME_PATH);

      // fill link and name
      openLinkModal();
      cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`).type('invalid');
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).type('name');
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });

    it('cannot have an empty name', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      // fill link and clear name
      createLink({ url: 'https://graasp.org' });
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).clear();
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });
  });
});
