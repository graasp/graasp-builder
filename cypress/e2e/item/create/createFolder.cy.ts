import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  ITEM_FORM_NAME_INPUT_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { CREATED_ITEM, SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createFolder } from '../../../support/createUtils';

describe('Create Folder', () => {
  describe('List', () => {
    it('create folder on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createFolder(CREATED_ITEM);

      cy.wait(['@postItem', '@getOwnItems']);
    });

    it('create folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createFolder(CREATED_ITEM);

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });
  });

  describe('Grid', () => {
    it('create folder on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // create
      createFolder(CREATED_ITEM);

      cy.wait('@postItem').then(() => {
        // check item is created and displayed
        cy.wait(CREATE_ITEM_PAUSE);
        // expect update
        cy.wait('@getOwnItems');

        // form is cleared
        cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click({ force: true });
        cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).should('have.value', '');
      });
    });

    it('create folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // create
      createFolder(CREATED_ITEM);

      cy.wait('@postItem').then(() => {
        // expect update
        cy.wait('@getItem').its('response.url').should('contain', id);
      });
    });
  });

  describe('Error handling', () => {
    it('error while creating folder does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, postItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      createFolder(CREATED_ITEM);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(buildItemsTableRowIdAttribute(body.id)).should('not.exist');
      });
    });
  });
});
