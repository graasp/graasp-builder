import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  CREATE_ITEM_BUTTON_ID,
  NEW_ITEM_CONFIRM_BUTTON_ID,
  NEW_ITEM_DESCRIPTION_INPUT_ID,
  NEW_ITEM_IMAGE_INPUT_ID,
  NEW_ITEM_NAME_INPUT_ID,
  NEW_ITEM_TYPE_SELECT_ID,
} from '../../src/config/selectors';
import { CREATED_ITEM, SIMPLE_ITEMS } from '../fixtures/items';

const createItem = ({
  name = '',
  type = 'Space',
  extra = {},
  description = '',
}) => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();

  cy.get(`#${NEW_ITEM_NAME_INPUT_ID}`).type(name);

  cy.get(`#${NEW_ITEM_DESCRIPTION_INPUT_ID}`).type(description);

  cy.get(`#${NEW_ITEM_TYPE_SELECT_ID}`).click();
  cy.get(`li[data-value="${type}"]`).click();
  cy.get(`#${NEW_ITEM_IMAGE_INPUT_ID}`).type(extra.image);

  cy.get(`#${NEW_ITEM_CONFIRM_BUTTON_ID}`).click();
};

describe('Create Item', () => {
  it('create item on Home', () => {
    cy.setUpApi();
    cy.visit('/');

    // create
    createItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.wait(1000);
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('create item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    createItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('error while creating item does not create in interface', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, postItemError: true });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    createItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemCard(body.id)}`).should('not.exist');
    });
  });
});
