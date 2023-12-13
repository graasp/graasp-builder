import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  TREE_MODAL_MY_ITEMS_ID,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const moveItem = ({
  id: movedItemId,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
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

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

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

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

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

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    const toItem = TREE_MODAL_MY_ITEMS_ID;
    moveItem({ id: movedItem, toItemPath: toItem });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      expect(url).to.contain(movedItem);
    });
  });
});
