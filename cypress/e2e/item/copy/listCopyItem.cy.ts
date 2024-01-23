import {
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../../../src/config/paths';
import {
  HOME_MODAL_ITEM_ID,
  ITEM_MENU_COPY_BUTTON_CLASS,
  TREE_MODAL_SHARED_ITEMS_ID,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';

const copyItem = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemPath, rootId);
};

describe('Copy Item in List', () => {
  it('copy item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[0];
    const { path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(copyItemId);
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(url).to.contain(copyItemId);
      expect(body.parentId).to.contain(toItem);
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    copyItem({ id: copyItemId, toItemPath: HOME_MODAL_ITEM_ID });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(copyItemId);

      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item in a shared item', () => {
    cy.setUpApi(SHARED_ITEMS);
    const { path } = SHARED_ITEMS.items[0];

    // go to children item
    cy.visit(SHARED_ITEMS_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

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
});
