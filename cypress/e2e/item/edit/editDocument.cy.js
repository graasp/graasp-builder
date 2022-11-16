import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
  buildSaveButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import {
  buildDocumentExtra,
  getDocumentExtra,
} from '../../../../src/utils/itemExtra';
import {
  GRAASP_DOCUMENT_CHILDREN_ITEM,
  GRAASP_DOCUMENT_ITEM,
  GRAASP_DOCUMENT_ITEMS_FIXTURE,
  GRAASP_DOCUMENT_PARENT_FOLDER,
} from '../../../fixtures/documents';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import {
  CAPTION_EDIT_PAUSE,
  EDIT_ITEM_PAUSE,
} from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

const content = 'new text';
const newFields = {
  ...EDITED_FIELDS,
  extra: buildDocumentExtra({ content }),
};

describe('Edit Document', () => {
  describe('List', () => {
    it('edit on Home', () => {
      cy.setUpApi({ items: [GRAASP_DOCUMENT_ITEM, GRAASP_LINK_ITEM] });
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      const itemToEdit = GRAASP_DOCUMENT_ITEM;

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
            body: { id, name, extra },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(getDocumentExtra(extra)?.content).to.contain(content);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });

    it('edit in folder', () => {
      cy.setUpApi({ items: GRAASP_DOCUMENT_ITEMS_FIXTURE });
      const parent = GRAASP_DOCUMENT_PARENT_FOLDER;
      // go to children item
      cy.visit(buildItemPath(parent.id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      const itemToEdit = GRAASP_DOCUMENT_CHILDREN_ITEM;

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
            body: { id, name, extra },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(getDocumentExtra(extra)?.content).to.contain(content);
          cy.get('@getItem').its('response.url').should('contain', parent.id);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit on Home', () => {
      cy.setUpApi({ items: GRAASP_DOCUMENT_ITEMS_FIXTURE });
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_DOCUMENT_ITEM;

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
            body: { id, name, extra },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(getDocumentExtra(extra)?.content).to.contain(content);
        },
      );
    });

    it('edit in folder', () => {
      cy.setUpApi({ items: GRAASP_DOCUMENT_ITEMS_FIXTURE });
      // go to children item
      const parent = GRAASP_DOCUMENT_PARENT_FOLDER;
      cy.visit(buildItemPath(parent.id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_DOCUMENT_CHILDREN_ITEM;

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
            body: { id, name, extra },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(newFields.name);
          expect(getDocumentExtra(extra)?.content).to.contain(content);
          cy.get('@getItem').its('response.url').should('contain', parent.id);
        },
      );
    });
  });

  describe('View Page', () => {
    it('edit text', () => {
      const { id } = GRAASP_DOCUMENT_ITEM;
      cy.setUpApi({ items: [GRAASP_DOCUMENT_ITEM] });
      cy.visit(buildItemPath(id));

      const caption = 'new text';
      cy.wait(CAPTION_EDIT_PAUSE);
      cy.get(`#${buildEditButtonId(id)}`).click();
      cy.get(`.${TEXT_EDITOR_CLASS}`).type(`{selectall}${caption}`);
      cy.get(`#${buildSaveButtonId(id)}`).click();

      cy.wait(`@editItem`).then(({ request: { url: endpointUrl, body } }) => {
        expect(endpointUrl).to.contain(id);
        // caption content might be wrapped with html tags
        expect(getDocumentExtra(body?.extra)?.content).to.contain(caption);
      });
    });
  });
});