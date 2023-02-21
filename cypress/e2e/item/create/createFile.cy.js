import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ITEM_LAYOUT_MODES } from '../../../fixtures/enums';
import { IMAGE_ITEM_DEFAULT, IMAGE_ITEM_S3 } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from '../../../support/createUtils';

describe('Create File', () => {
  it('create file on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(IMAGE_ITEM_DEFAULT, ITEM_LAYOUT_MODES.LIST);

    cy.wait('@uploadItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);
      // should update view
      cy.wait('@getOwnItems');
    });
  });

  it('create file in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(IMAGE_ITEM_S3, ITEM_LAYOUT_MODES.LIST);

    cy.wait('@uploadItem').then(() => {
      // should update view
      cy.wait('@getItem');
    });
  });
});
