import { ITEM_LAYOUT_MODES, ROOT_ID } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const moveItem = (movedItemId, toItemId) => {
  const menuSelector = `#${buildItemCard(
    movedItemId,
  )} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();

  cy.fillTreeModal(toItemId);
};

describe('Move Item in Grid', () => {
  it('move item on Home', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: movedItem } = SAMPLE_ITEMS[0];
    const { id: toItem } = SAMPLE_ITEMS[1];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItemInGrid(toItem);
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('move item in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: movedItem } = SAMPLE_ITEMS[2];
    const { id: toItem } = SAMPLE_ITEMS[3];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItemInGrid(toItem);
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('move item to Home', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: movedItem } = SAMPLE_ITEMS[2];
    const toItem = ROOT_ID;
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  describe('Error handling', () => {
    it.only('error while moving item does not create in interface', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS, moveItemError: true });
      const { id } = SAMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // move
      const { id: movedItem } = SAMPLE_ITEMS[2];
      const { id: toItem } = SAMPLE_ITEMS[3];
      moveItem(movedItem, toItem);

      cy.wait('@moveItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`#${buildItemCard(body.id)}`).should('not.exist');
      });
    });
  });
});
