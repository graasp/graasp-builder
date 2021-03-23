import { MODES, DEFAULT_MODE } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { IMAGE_ITEM_DEFAULT, IMAGE_ITEM_S3 } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from './utils';

describe('Create File', () => {
  it('create file on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // create
    createItem(IMAGE_ITEM_DEFAULT, MODES.LIST);

    cy.wait('@uploadItem').then(() => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);
      // should update view
      cy.wait('@getOwnItems');
    });
  });

  it('create file in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_MODE !== MODES.LIST) {
      cy.switchMode(MODES.LIST);
    }

    // create
    createItem(IMAGE_ITEM_S3, MODES.LIST);

    cy.wait('@uploadItem').then(() => {
      // should update view
      cy.wait('@getItem');
    });
  });
});
