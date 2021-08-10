import {
  DEFAULT_ITEM_LAYOUT_MODE,
  ROOT_ID,
} from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';

import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowIdAttribute,
  buildItemMenu,
  ITEM_MENU_COPY_BUTTON_CLASS,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const copyItem = ({ id, toItemPath }) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemPath);
};

describe('Copy Item in List', () => {
  it('copy item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[0];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');

      // check in new parent
      cy.goToItemInList(toItem);
      cy.get(buildItemsTableRowIdAttribute(body.id)).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');

      // check in new parent
      cy.goToItemInList(toItem);
      cy.get(buildItemsTableRowIdAttribute(body.id)).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    copyItem({ id: copyItemId, toItemPath: ROOT_ID });

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');

      // check in new parent
      cy.goToHome();
      cy.get(buildItemsTableRowIdAttribute(body.id)).should('exist');
    });
  });

  describe('Error handling', () => {
    it('error while moving item does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, copyItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));
      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // copy
      const { id: copyItemId } = SAMPLE_ITEMS.items[2];
      const { path: toItemPath } = SAMPLE_ITEMS.items[0];
      copyItem({ id: copyItemId, toItemPath });

      cy.wait('@copyItem').then(({ response: { body } }) => {
        // check item is still existing in parent
        cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
        cy.get(buildItemsTableRowIdAttribute(body.id)).should('not.exist');
      });
    });
  });
});
