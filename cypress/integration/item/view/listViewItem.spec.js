import { MODES, DEFAULT_MODE } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  ITEMS_TABLE_EMPTY_ROW_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

describe('Create Item in List', () => {
  it('visit Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // should get own items
    cy.wait('@getOwnItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
      }
    });

    // visit child
    const { id: childId } = SIMPLE_ITEMS[0];
    cy.goToItemInList(childId);

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
      }
    });

    // visit child
    const { id: childChildId } = SIMPLE_ITEMS[2];
    cy.goToItemInList(childChildId);

    // expect no children
    cy.get(`#${ITEMS_TABLE_EMPTY_ROW_ID}`).should('exist');

    // return parent with navigation and should display children
    cy.goToItemWithNavigation(childId);
    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
      }
    });
  });

  it('visit item by id', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];
    cy.visit(buildItemPath(id));

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // should get current item
    cy.wait('@getItem');

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
      }
    });

    // visit home
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();

    // should get own items
    cy.wait('@getOwnItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemsTableRowId(item.id)}`).should('exist');
      }
    });
  });

  describe('Errors handling', () => {
    it('visiting non-existing item display no item here', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, getItemError: true });
      const { id } = SIMPLE_ITEMS[0];
      cy.visit(buildItemPath(id));

      // should get current item
      cy.wait('@getItem').then(() => {
        cy.get(`#${ITEM_SCREEN_ERROR_ALERT_ID}`).should('exist');
      });
    });
  });
});
