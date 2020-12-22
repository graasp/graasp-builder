import { ROOT_ID } from '../../src/config/constants';
import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  buildItemMenu,
  buildTreeItemClass,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  NAVIGATION_HOME_LINK_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_TREE_ID,
} from '../../src/config/selectors';
import { SIMPLE_ITEMS } from '../fixtures/items';

const copyItem = (id, toItemId) => {
  const menuSelector = `#${buildItemCard(id)} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();

  cy.get(
    `#${TREE_MODAL_TREE_ID} .${buildTreeItemClass(
      toItemId,
    )} .MuiTreeItem-label`,
  )
    .first()
    .click();

  cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
};

describe('Copy Item', () => {
  it('copy item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit('/');

    // move
    const { id: movedItem } = SIMPLE_ITEMS[0];
    const { id: toItem } = SIMPLE_ITEMS[1];
    copyItem(movedItem, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(movedItem)}`).should('exist');

      // check in new parent
      cy.get(`#${buildItemLink(toItem)}`).click();
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const { id: toItem } = SIMPLE_ITEMS[3];
    copyItem(movedItem, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(movedItem)}`).should('exist');

      // check in new parent
      cy.get(`#${buildItemLink(toItem)}`).click();
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const toItem = ROOT_ID;
    copyItem(movedItem, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(movedItem)}`).should('exist');

      // check in new parent
      cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('error while moving item does not create in interface', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, copyItemError: true });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = SIMPLE_ITEMS[2];
    const { id: toItem } = SIMPLE_ITEMS[0];
    copyItem(movedItem, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      // check item is still existing in parent
      cy.get(`#${buildItemCard(movedItem)}`).should('exist');
      cy.get(`#${buildItemCard(body.id)}`).should('not.exist');
    });
  });
});
