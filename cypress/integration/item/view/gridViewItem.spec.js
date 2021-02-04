import { MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  ITEMS_GRID_NO_ITEM_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

describe('Create Item in Grid', () => {
  it('visit Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.GRID);

    // should get own items
    cy.wait('@getOwnItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // visit child
    const { id: childId } = SIMPLE_ITEMS[0];
    cy.goToItemInGrid(childId);

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // visit child
    const { id: childChildId } = SIMPLE_ITEMS[2];
    cy.goToItemInGrid(childChildId);

    // expect no children
    cy.get(`#${ITEMS_GRID_NO_ITEM_ID}`).should('exist');

    // return parent with navigation and should display children
    cy.goToItemWithNavigation(childId);
    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });
  });

  it('visit item by id', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.GRID);

    // should get current item
    cy.wait('@getItem');

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // visit home
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();

    // should get own items
    cy.wait('@getOwnItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
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
