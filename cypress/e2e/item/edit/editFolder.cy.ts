import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  EDIT_ITEM_BUTTON_CLASS,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  buildItemsGridMoreButtonSelector,
} from '../../../../src/config/selectors';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

const EDITED_FIELDS = {
  name: 'new name',
};

describe('Edit Folder', () => {
  it('confirm with empty name', () => {
    const item = PackedFolderItemFactory();
    cy.setUpApi({ items: [item] });
    cy.visit(HOME_PATH);

    // click edit button
    const itemId = item.id;
    cy.get(buildItemsGridMoreButtonSelector(itemId)).click();
    cy.get(`.${EDIT_ITEM_BUTTON_CLASS}`).click();

    cy.fillFolderModal(
      {
        // put an empty name for the folder
        name: '',
      },
      { confirm: false },
    );

    // check that the button can not be clicked
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should('be.disabled');
  });

  it('edit folder on Home', () => {
    const item = PackedFolderItemFactory();
    cy.setUpApi({ items: [item] });
    cy.visit(HOME_PATH);

    const itemToEdit = item;
    const newDescription = 'new description';
    // edit
    cy.get(buildItemsGridMoreButtonSelector(itemToEdit.id)).click();
    editItem({
      ...itemToEdit,
      ...EDITED_FIELDS,
      description: newDescription,
    });

    cy.wait('@editItem').then(
      ({
        response: {
          body: { id, name, description },
        },
      }) => {
        // check item is edited and updated
        expect(id).to.equal(itemToEdit.id);
        expect(name).to.equal(EDITED_FIELDS.name);
        expect(description).to.contain(newDescription);
        cy.wait(EDIT_ITEM_PAUSE);
        cy.wait('@getAccessibleItems');
      },
    );
  });

  it('edit folder in item', () => {
    const parentItem = PackedFolderItemFactory();
    const itemToEdit = PackedFolderItemFactory({ parentItem });
    cy.setUpApi({ items: [parentItem, itemToEdit] });
    // go to children item
    cy.visit(buildItemPath(itemToEdit.id));

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
        expect(id).to.equal(itemToEdit.id);
        expect(name).to.equal(EDITED_FIELDS.name);
        cy.get('@getItem').its('response.url').should('contain', itemToEdit.id);
      },
    );
  });
});
