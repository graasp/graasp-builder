import { PackedEtherpadItemFactory } from '@graasp/sdk';

import { buildItemsGridMoreButtonSelector } from '@/config/selectors';

import { HOME_PATH } from '../../../../src/config/paths';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

const EDITED_FIELDS = {
  name: 'new name',
};

const GRAASP_ETHERPAD_ITEM = PackedEtherpadItemFactory();

describe('Edit Etherpad', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [GRAASP_ETHERPAD_ITEM] });
  });

  it('edit etherpad on Home', () => {
    cy.visit(HOME_PATH);

    const itemToEdit = GRAASP_ETHERPAD_ITEM;

    // edit
    cy.get(buildItemsGridMoreButtonSelector(itemToEdit.id)).click();
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
        cy.get('@getAccessibleItems');
        expect(id).to.equal(itemToEdit.id);
        expect(name).to.equal(EDITED_FIELDS.name);
      },
    );
  });
});
