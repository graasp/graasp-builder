import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { buildItemsTableRowId } from '../../../../src/config/selectors';
import { CREATED_ITEM, SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from './utils';

describe('Create Folder', () => {
  describe('List', () => {
    it('create folder on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM, ITEM_LAYOUT_MODES.LIST);

      cy.wait(['@postItem', '@getOwnItems']);
    });

    it('create folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM, ITEM_LAYOUT_MODES.LIST);

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
      createItem(CREATED_ITEM, ITEM_LAYOUT_MODES.GRID);

      cy.wait('@postItem').then(() => {
        // check item is created and displayed
        cy.wait(CREATE_ITEM_PAUSE);
        // expect update
        cy.wait('@getOwnItems');
      });
    });

    it('create folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // create
      createItem(CREATED_ITEM, ITEM_LAYOUT_MODES.GRID);

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

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM, ITEM_LAYOUT_MODES.LIST);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`[ row-id = "${buildItemsTableRowId(body.id)}"]`).should(
          'not.exist',
        );
      });
    });
  });
});
