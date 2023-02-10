import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import {
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../../../src/config/paths';
import {
  EDIT_ITEM_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  TREE_MODAL_MY_ITEMS_ID,
  TREE_MODAL_SHARED_ITEMS_ID,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../fixtures/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const copyItem = ({ id, toItemPath, rootId }) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemPath, rootId);
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

    cy.wait('@copyItems').then(({ response: { body } }) => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');

      // check in new parent
      cy.goToItemInList(toItem);
      cy.get(buildItemsTableRowIdAttribute(body[0].id)).should('exist');
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

    cy.wait('@copyItems').then(({ response: { body } }) => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');

      // check in new parent
      cy.goToItemInList(toItem);
      cy.get(buildItemsTableRowIdAttribute(body[0].id)).should('exist');
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
    copyItem({ id: copyItemId, toItemPath: TREE_MODAL_MY_ITEMS_ID });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');

      // check in new parent
      cy.goToHome();
      cy.get(buildItemsTableRowIdAttribute(body[0].id)).should('exist');
    });
  });

  it('copy item in a shared item', () => {
    cy.setUpApi(SHARED_ITEMS);
    const { path } = SHARED_ITEMS.items[0];

    // go to children item
    cy.visit(SHARED_ITEMS_PATH);
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // copy
    const { id: copyItemId } = SHARED_ITEMS.items[1];
    copyItem({
      id: copyItemId,
      toItemPath: path,
      rootId: TREE_MODAL_SHARED_ITEMS_ID,
    });

    cy.wait('@copyItems').then(() => {
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  describe('Error handling', () => {
    it('error while copying item does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, copyItemsError: true });
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

      cy.wait('@copyItems').then(() => {
        // check item is still existing in parent
        cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
        cy.get(`#${buildItemsTableId(id)} .${EDIT_ITEM_BUTTON_CLASS}`).should(
          'have.length',
          3,
        );
      });
    });
  });
});
