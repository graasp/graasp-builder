import { HOME_PATH } from '../../../../src/config/paths';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { GRAASP_ETHERPAD_ITEM } from '../../../fixtures/etherpad';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

describe('Edit Etherpad', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [GRAASP_ETHERPAD_ITEM] });
  });

  describe('List', () => {
    it('edit etherpad on Home', () => {
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      const itemToEdit = GRAASP_ETHERPAD_ITEM;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit etherpad on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_ETHERPAD_ITEM;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });
  });
});
