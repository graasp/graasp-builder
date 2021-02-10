import { DEFAULT_MODE, MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  EDIT_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { EDITED_FIELDS, SIMPLE_ITEMS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';

const editItem = (payload) => {
  const { id } = payload;
  cy.get(`#${buildItemsTableRowId(id)} .${EDIT_ITEM_BUTTON_CLASS}`).click();

  cy.fillItemModal(payload);
};

describe('Edit Item in List', () => {
  it('edit item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    const itemToEdit = SIMPLE_ITEMS[0];

    // edit
    editItem({
      ...itemToEdit,
      ...EDITED_FIELDS,
    });

    cy.wait('@editItem').then(
      ({
        response: {
          body: { id, name },
        },
      }) => {
        // check item is edited and updated
        cy.wait(EDIT_ITEM_PAUSE);
        cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
        cy.get(`#${buildItemsTableRowId(id)}`).contains(name);
      },
    );
  });

  it('create item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    // go to children item
    cy.visit(buildItemPath(SIMPLE_ITEMS[0].id));

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    const itemToEdit = SIMPLE_ITEMS[2];

    // edit
    editItem({
      ...itemToEdit,
      ...EDITED_FIELDS,
    });

    cy.wait('@editItem').then(
      ({
        response: {
          body: { id, name },
        },
      }) => {
        // check item is edited and updated
        cy.wait(EDIT_ITEM_PAUSE);
        cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
        cy.get(`#${buildItemsTableRowId(id)}`).contains(name);
      },
    );
  });
});
