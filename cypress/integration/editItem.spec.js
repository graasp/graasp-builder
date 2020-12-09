import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_EDIT_BUTTON_CLASS,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DESCRIPTION_INPUT_ID,
  ITEM_FORM_IMAGE_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_FORM_TYPE_SELECT_ID,
} from '../../src/config/selectors';
import { SIMPLE_ITEMS } from '../fixtures/items';

const editItem = ({
  id,
  name = '',
  type = 'Space',
  extra = {},
  description = '',
}) => {
  const menuSelector = `#${buildItemCard(id)} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_EDIT_BUTTON_CLASS}`).click();

  cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).clear().type(name);

  cy.get(`#${ITEM_FORM_DESCRIPTION_INPUT_ID}`).clear().type(description);

  cy.get(`#${ITEM_FORM_TYPE_SELECT_ID}`).click();
  cy.get(`li[data-value="${type}"]`).click();
  cy.get(`#${ITEM_FORM_IMAGE_INPUT_ID}`).clear().type(extra.image);

  cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
};

describe('Edit Item', () => {
  it('edit item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit('/');

    const itemToEdit = SIMPLE_ITEMS[0];
    const newName = 'new name';
    const newDescription = 'new description';

    // create
    editItem({
      ...itemToEdit,
      name: newName,
      description: newDescription,
    });

    cy.wait('@editItem').then(
      ({
        response: {
          body: { id, name },
        },
      }) => {
        // check item is created and displayed
        cy.wait(1000);
        cy.get(`#${buildItemCard(id)}`).should('exist');
        cy.get(`#${buildItemLink(id)}`).contains(name);
      },
    );
  });

  it('create item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    // go to children item
    cy.visit(buildItemPath(SIMPLE_ITEMS[0].id));

    const itemToEdit = SIMPLE_ITEMS[2];
    const newName = 'new name';
    const newDescription = 'new description';

    // create
    editItem({
      ...itemToEdit,
      name: newName,
      description: newDescription,
    });

    cy.wait('@editItem').then(
      ({
        response: {
          body: { id, name },
        },
      }) => {
        // check item is created and displayed
        cy.wait(1000);
        cy.get(`#${buildItemCard(id)}`).should('exist');
        cy.get(`#${buildItemLink(id)}`).contains(name);
      },
    );
  });
});
