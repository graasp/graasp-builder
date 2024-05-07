import {
  ItemType,
  PackedAppItemFactory,
  PackedFolderItemFactory,
  buildAppExtra,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  EDIT_MODAL_ID,
  ITEM_MAIN_CLASS,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { buildAppItemLinkForTest } from '../../../fixtures/apps';
import { CURRENT_USER, MEMBERS } from '../../../fixtures/members';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from '../../../support/editUtils';

const url = 'http://localhost:3334';

const newFields = {
  name: 'new name',
  extra: buildAppExtra({ url }),
};

const GRAASP_APP_ITEM = PackedAppItemFactory({
  name: 'test app',
  description: 'my app description',
  creator: CURRENT_USER,
});

const GRAASP_APP_PARENT_FOLDER = PackedFolderItemFactory({
  name: 'graasp app parent',
});

const APP_USING_CONTEXT_ITEM = PackedAppItemFactory({
  name: 'my app',
  extra: {
    [ItemType.APP]: {
      url: `${Cypress.env('VITE_GRAASP_API_HOST')}/${buildAppItemLinkForTest('app.html')}`,
    },
  },
  creator: MEMBERS.ANNA,
  parentItem: GRAASP_APP_PARENT_FOLDER,
});

describe('Edit App', () => {
  describe('View Page', () => {
    beforeEach(() => {
      const { id } = GRAASP_APP_ITEM;
      cy.setUpApi({ items: [GRAASP_APP_ITEM] });
      cy.visit(buildItemPath(id));
    });

    it('edit caption', () => {
      const { id } = GRAASP_APP_ITEM;
      const caption = 'new caption';
      editCaptionFromViewPage({ id, caption });
      cy.wait(`@editItem`).then(({ request: { url: endpointUrl, body } }) => {
        expect(endpointUrl).to.contain(id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });

    it('cancel caption', () => {
      const { id, description } = GRAASP_APP_ITEM;
      cy.get(`#${buildEditButtonId(id)}`).click();
      cy.get(`#${EDIT_MODAL_ID} .${TEXT_EDITOR_CLASS}`).type(
        '{selectall}{backspace}',
      );
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).click();
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).should('not.exist');
      cy.get(`.${ITEM_MAIN_CLASS} .${TEXT_EDITOR_CLASS}`)
        .scrollIntoView()
        .should('be.visible')
        .and('contain.text', description);
    });
  });

  describe('List', () => {
    it('edit app on Home', () => {
      const itemToEdit = GRAASP_APP_ITEM;
      cy.setUpApi({ items: [itemToEdit] });
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ItemLayoutMode.List,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getAccessibleItems');
        },
      );
    });

    it('edit app in item', () => {
      const parentItem = PackedFolderItemFactory();
      const itemToEdit = PackedAppItemFactory({ parentItem });
      cy.setUpApi({
        items: [parentItem, itemToEdit],
      });
      // go to children item
      cy.visit(buildItemPath(parentItem.id));

      cy.switchMode(ItemLayoutMode.List);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ItemLayoutMode.List,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', parentItem.id);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit app on Home', () => {
      const itemToEdit = GRAASP_APP_ITEM;
      cy.setUpApi({ items: [itemToEdit] });
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ItemLayoutMode.Grid,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getAccessibleItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
        },
      );
    });

    it('edit app in item', () => {
      const itemToEdit = APP_USING_CONTEXT_ITEM;
      const parent = GRAASP_APP_PARENT_FOLDER;
      cy.setUpApi({ items: [parent, itemToEdit] });
      // go to children item
      cy.visit(buildItemPath(parent.id));
      cy.switchMode(ItemLayoutMode.Grid);

      // edit
      editItem(
        {
          ...itemToEdit,
          ...newFields,
        },
        ItemLayoutMode.Grid,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          cy.get('@getItem').its('response.url').should('contain', parent.id);
        },
      );
    });
  });
});
