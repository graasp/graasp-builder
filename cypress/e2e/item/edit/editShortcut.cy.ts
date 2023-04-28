import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { HOME_PATH } from '../../../../src/config/paths';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { EDITED_FIELDS, SHORTCUT } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM } from '../../../fixtures/links';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

describe('Edit Shortcut', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [SHORTCUT, GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM] });
  });

  describe('List', () => {
    it('edit shortcut on Home', () => {
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      const itemToEdit = SHORTCUT;

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
    it('edit shortcut on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = SHORTCUT;

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
