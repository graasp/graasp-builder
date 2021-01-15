import { ROOT_ID } from '../../src/config/constants';
import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  buildTreeItemClass,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  NAVIGATION_HOME_LINK_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_TREE_ID,
} from '../../src/config/selectors';
import { SIMPLE_ITEMS } from '../fixtures/items';

const moveItem = (movedItemId, toItemId) => {
  const menuSelector = `#${buildItemCard(
    movedItemId,
  )} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();

  cy.get(
    `#${TREE_MODAL_TREE_ID} .${buildTreeItemClass(
      toItemId,
    )} .MuiTreeItem-label`,
  )
    .first()
    .click();

  cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
};

describe('Move Item', () => {
  it('move item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit('/');

    // move
    const { id: movedItem } = SIMPLE_ITEMS[0];
    const { id: toItem } = SIMPLE_ITEMS[1];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItem(toItem);
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('move item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const { id: toItem } = SIMPLE_ITEMS[3];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItem(toItem);
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('move item to Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const toItem = ROOT_ID;
    moveItem(movedItem, toItem);

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('error while moving item does not create in interface', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, moveItemError: true });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const { id: toItem } = SIMPLE_ITEMS[3];
    moveItem(movedItem, toItem);

    cy.wait('@moveItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemCard(body.id)}`).should('not.exist');
    });
  });
});
