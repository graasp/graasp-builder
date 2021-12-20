import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { ZIP_DEFAULT } from '../../../fixtures/files';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { createItem } from './utils';

describe('Import Zip', () => {
  it('import zip on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(ZIP_DEFAULT);

    cy.wait('@importZip');
  });

  it('create file in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(ZIP_DEFAULT);

    cy.wait('@importZip').then(({ response: { url } }) => {
      expect(url).to.contain(id);
    });
  });

  it.only('catch error', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, importZipError: true });
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(ZIP_DEFAULT);

    cy.wait('@importZip').then(({ response: { url } }) => {
      expect(url).to.contain(id);
    });
  });
});
