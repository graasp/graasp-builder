import { MODES, DEFAULT_MODE } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemsTableRowId,
} from '../../../../src/config/selectors';
import { CREATED_ITEM, SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from './utils';

describe('Create Space', () => {
  describe('List', () => {
    it('create space on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM, MODES.LIST);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.wait(CREATE_ITEM_PAUSE);
        cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
      });
    });

    it('create space in item', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      const { id } = SAMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM, MODES.LIST);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
      });
    });
  });

  describe('Grid', () => {
    it('create space on Home', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      cy.switchMode(MODES.GRID);

      // create
      createItem(CREATED_ITEM, MODES.GRID);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.wait(CREATE_ITEM_PAUSE);
        cy.get(`#${buildItemCard(body.id)}`).should('exist');
      });
    });

    it('create space in item', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      const { id } = SAMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(MODES.GRID);

      // create
      createItem(CREATED_ITEM, MODES.GRID);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`#${buildItemCard(body.id)}`).should('exist');
      });
    });
  });

  describe('Errors handling', () => {
    it('error while creating space does not create in interface', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS, postItemError: true });
      const { id } = SAMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM, MODES.LIST);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`#${buildItemsTableRowId(body.id)}`).should('not.exist');
      });
    });
  });
});
