import {
  DEFAULT_ITEM_LAYOUT_MODE,
  ITEM_LAYOUT_MODES,
} from '../../../../src/config/constants';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  buildItemsTableRowId,
} from '../../../../src/config/selectors';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM } from '../../../fixtures/links';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from './utils';

describe('Edit Link', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM] });
  });

  describe('List', () => {
    it('edit link on Home', () => {
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      const itemToEdit = GRAASP_LINK_ITEM;

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
          cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
          cy.get(`#${buildItemsTableRowId(id)}`).contains(name);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit link on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_LINK_ITEM;

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
          cy.get(`#${buildItemCard(id)}`).should('exist');
          cy.get(`#${buildItemLink(id)}`).contains(name);
        },
      );
    });
  });
});
