import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { buildAppExtra } from '../../../../src/utils/itemExtra';
import {
  GRAASP_APP_CHILDREN_ITEM,
  GRAASP_APP_ITEM,
  GRAASP_APP_PARENT_FOLDER,
  GRAASP_APP_ITEMS_FIXTURE,
} from '../../../fixtures/apps';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from './utils';

const url = 'http://localhost:3334';
const newFields = {
  ...EDITED_FIELDS,
  extra: buildAppExtra({ url }),
};

describe('Edit App', () => {
  describe('List', () => {
    it('edit app on Home', () => {
      const itemToEdit = GRAASP_APP_ITEM;
      cy.setUpApi({ items: [itemToEdit, GRAASP_LINK_ITEM] });
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(description).to.equal(newFields.description);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });

    it('edit app in item', () => {
      const itemToEdit = GRAASP_APP_CHILDREN_ITEM;
      cy.setUpApi({ items: GRAASP_APP_ITEMS_FIXTURE });
      const parent = GRAASP_APP_PARENT_FOLDER;
      // go to children item
      cy.visit(buildItemPath(parent.id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(description).to.equal(newFields.description);
          cy.get('@getItem').its('response.url').should('contain', parent.id);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit app on Home', () => {
      cy.setUpApi({ items: GRAASP_APP_ITEMS_FIXTURE });
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_APP_ITEM;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(description).to.equal(newFields.description);
        },
      );
    });

    it('edit app in item', () => {
      cy.setUpApi({ items: GRAASP_APP_ITEMS_FIXTURE });
      // go to children item
      const parent = GRAASP_APP_PARENT_FOLDER;
      cy.visit(buildItemPath(parent.id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_APP_CHILDREN_ITEM;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(description).to.equal(newFields.description);
          cy.get('@getItem').its('response.url').should('contain', parent.id);
        },
      );
    });
  });
});
