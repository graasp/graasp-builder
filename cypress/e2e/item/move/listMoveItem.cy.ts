import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import {
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../../../src/config/paths';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  TREE_MODAL_MY_ITEMS_ID,
  TREE_MODAL_SHARED_ITEMS_ID,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const moveItem = ({ id: movedItemId, toItemPath, rootId }: { id: string, toItemPath: string, rootId?: string }) => {
  const menuSelector = `#${buildItemMenuButtonId(movedItemId)}`;
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(menuSelector).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();

  cy.fillTreeModal(toItemPath, rootId);
};

describe('Move Item in List', () => {
  it('move item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[0];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    const toItem = TREE_MODAL_MY_ITEMS_ID;
    moveItem({ id: movedItem, toItemPath: toItem });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item in shared item', () => {
    cy.setUpApi(SHARED_ITEMS);

    // go to children item
    cy.visit(SHARED_ITEMS_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // move
    const { path: toItemPath, id: toItemId } = SHARED_ITEMS.items[0];
    const { id: movedItem } = SHARED_ITEMS.items[1];
    moveItem({ id: movedItem, toItemPath, rootId: TREE_MODAL_SHARED_ITEMS_ID });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItemId);
      expect(url).to.contain(movedItem);
    });
  });

  describe('Error handling', () => {
    it('error while moving item does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, moveItemsError: true });
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // move
      const { id: movedItem } = SAMPLE_ITEMS.items[2];
      const { path: toItemPath } = SAMPLE_ITEMS.items[3];
      moveItem({ id: movedItem, toItemPath });

      cy.wait('@moveItems').then(() => {
        // check item is still there
        cy.get(buildItemsTableRowIdAttribute(movedItem)).should('exist');
      });
    });
  });
});
