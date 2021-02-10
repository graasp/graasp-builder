import { MODES, DEFAULT_MODE } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  CREATE_ITEM_BUTTON_ID,
} from '../../../../src/config/selectors';
import { CREATED_ITEM, SIMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';

const createItem = (payload) => {
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();

  cy.fillItemModal(payload);
};

describe('Create Item in List', () => {
  it('create item on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // create
    createItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  it('create item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // create
    createItem(CREATED_ITEM);

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  describe('Errors handling', () => {
    it('error while creating item does not create in interface', () => {
      cy.setUpApi({ items: SIMPLE_ITEMS, postItemError: true });
      const { id } = SIMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      // create
      createItem(CREATED_ITEM);

      cy.wait('@postItem').then(({ response: { body } }) => {
        // check item is created and displayed
        cy.get(`#${buildItemsTableRowId(body.id)}`).should('not.exist');
      });
    });
  });
});
