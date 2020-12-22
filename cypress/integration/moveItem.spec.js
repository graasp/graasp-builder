import 'cypress-react-selector';
import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
} from '../../src/config/selectors';
import { CREATED_ITEM, SIMPLE_ITEMS } from '../fixtures/items';

const moveItem = (movedItemId, toItem) => {
  // eslint-disable-next-line no-console
  console.log(toItem);
  const menuSelector = `#${buildItemCard(
    movedItemId,
  )} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(`${menuSelector} .${ITEM_MENU_MOVE_BUTTON_CLASS}`).click();

  cy.react('TreeItem').should('exist');
};

describe('Move Item', () => {
  it('move item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit('/');
    cy.waitForReact();

    // create
    // const movedItem = SIMPLE_ITEMS[0];
    // moveItem(movedItem.id, SIMPLE_ITEMS[1]);

    // cy.wait('@moveItem').then(() => {
    //   // check item is created and displayed
    //   cy.get(`#${buildItemCard(movedItem.id)}`).should('not.exist');
    // });
  });

  it.skip('move item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    moveItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it.skip('error while moving item does not create in interface', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, postItemError: true });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    moveItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemCard(body.id)}`).should('not.exist');
    });
  });
});
