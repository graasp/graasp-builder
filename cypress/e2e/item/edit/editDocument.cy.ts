import {
  PackedDocumentItemFactory,
  PackedFolderItemFactory,
  buildDocumentExtra,
  getDocumentExtra,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  EDIT_MODAL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
  buildItemsGridMoreButtonSelector,
} from '../../../../src/config/selectors';
import {
  CAPTION_EDIT_PAUSE,
  EDIT_ITEM_PAUSE,
} from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

const content = 'new text';
const newFields = {
  name: 'new name',
  extra: buildDocumentExtra({ content }),
};

const GRAASP_DOCUMENT_ITEM = PackedDocumentItemFactory({
  name: 'graasp text',
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
});
const GRAASP_FOLDER_PARENT = PackedFolderItemFactory();
const GRAASP_DOCUMENT_ITEM_CHILD = PackedDocumentItemFactory({
  name: 'graasp text',
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
  parentItem: GRAASP_FOLDER_PARENT,
});

describe('Edit Document', () => {
  it('edit on Home', () => {
    cy.setUpApi({ items: [GRAASP_DOCUMENT_ITEM] });
    cy.visit(HOME_PATH);

    const itemToEdit = GRAASP_DOCUMENT_ITEM;

    cy.get(buildItemsGridMoreButtonSelector(itemToEdit.id)).click();
    // edit
    editItem({
      ...itemToEdit,
      ...newFields,
    });

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
        cy.wait('@getAccessibleItems');
      },
    );
  });

  it('edit in folder', () => {
    const parent = GRAASP_FOLDER_PARENT;
    const itemToEdit = GRAASP_DOCUMENT_ITEM_CHILD;
    cy.setUpApi({ items: [parent, itemToEdit] });
    // go to children item
    cy.visit(buildItemPath(parent.id));

    // edit
    cy.get(buildItemsGridMoreButtonSelector(itemToEdit.id)).click();
    editItem(
      {
        ...itemToEdit,
        ...newFields,
      },
      'ul',
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

  describe('View Page', () => {
    it('edit text', () => {
      const { id } = GRAASP_DOCUMENT_ITEM;
      cy.setUpApi({ items: [GRAASP_DOCUMENT_ITEM] });
      cy.visit(buildItemPath(id));

      const caption = 'new text';
      cy.wait(CAPTION_EDIT_PAUSE);
      cy.get(`#${buildEditButtonId(id)}`).click();
      cy.get(`#${EDIT_MODAL_ID} .${TEXT_EDITOR_CLASS}`).type(
        `{selectall}${caption}`,
      );
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

      cy.wait(`@editItem`).then(({ request: { url: endpointUrl, body } }) => {
        expect(endpointUrl).to.contain(id);
        // caption content might be wrapped with html tags
        expect(getDocumentExtra(body?.extra)?.content).to.contain(caption);
      });
    });
  });
});
