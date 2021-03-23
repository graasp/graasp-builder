import { DEFAULT_MODE, MODES } from '../../../../src/config/constants';
import { HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  buildItemsTableRowId,
} from '../../../../src/config/selectors';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from './utils';

describe('Edit File', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3] });
  });

  describe('List', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);

      if (DEFAULT_MODE !== MODES.LIST) {
        cy.switchMode(MODES.LIST);
      }

      const itemToEdit = IMAGE_ITEM_DEFAULT;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        MODES.LIST,
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
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(MODES.GRID);

      const itemToEdit = VIDEO_ITEM_S3;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        MODES.GRID,
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
