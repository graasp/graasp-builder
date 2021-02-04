import { MODES, ROOT_ID } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

const moveItem = (movedItemId, toItemId) => {
  const menuSelector = `#${buildItemsTableRowId(
    movedItemId,
  )} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();

  cy.fillTreeModal(toItemId);
};

describe('Move Item in List', () => {
  it('move item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.LIST);

    // move
    const { id: movedItem } = SIMPLE_ITEMS[0];
    const { id: toItem } = SIMPLE_ITEMS[1];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemsTableRowId(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItemInList(toItem);
    cy.get(`#${buildItemsTableRowId(movedItem)}`).should('exist');
  });

  it('move item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.LIST);

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const { id: toItem } = SIMPLE_ITEMS[3];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemsTableRowId(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItemInList(toItem);
    cy.get(`#${buildItemsTableRowId(movedItem)}`).should('exist');
  });

  it('move item to Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(MODES.LIST);

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const toItem = ROOT_ID;
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemsTableRowId(movedItem)}`).should('not.exist');

    // check in new parent
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
    cy.get(`#${buildItemsTableRowId(movedItem)}`).should('exist');
  });

  describe('Errors handling', () => {
    it('error while moving item does not create in interface', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, moveItemError: true });
      const { id } = SIMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(MODES.LIST);

      // move
      const { id: movedItem } = SIMPLE_ITEMS[2];
      const { id: toItem } = SIMPLE_ITEMS[3];
      moveItem(movedItem, toItem);

      cy.wait('@moveItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`#${buildItemsTableRowId(body.id)}`).should('not.exist');
      });
    });
  });
});
