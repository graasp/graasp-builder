import { MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  EDIT_ITEM_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { EDITED_FIELDS, SIMPLE_ITEMS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';

const editItem = (payload) => {
  const { id } = payload;
  const button = `#${buildItemCard(id)} .${EDIT_ITEM_BUTTON_CLASS}`;
  cy.get(button).click();

  cy.fillItemModal(payload);
};

describe('Edit Item in Grid', () => {
  it('edit item on Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(MODES.GRID);

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
        cy.get(`#${buildItemCard(id)}`).should('exist');
        cy.get(`#${buildItemLink(id)}`).contains(name);
      },
    );
  });

  it('create item in item', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    // go to children item
    cy.visit(buildItemPath(SIMPLE_ITEMS[0].id));
    cy.switchMode(MODES.GRID);

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
        cy.get(`#${buildItemCard(id)}`).should('exist');
        cy.get(`#${buildItemLink(id)}`).contains(name);
      },
    );
  });
});
