import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const moveItem = ({
  id: movedItemId,
  toItemPath,
}: {
  id: string;
  toItemPath: string;
}) => {
  const menuSelector = `#${buildItemMenuButtonId(movedItemId)}`;
  cy.get(menuSelector).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();

  cy.handleTreeMenu(toItemPath);
};

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();

const items = [IMAGE_ITEM, FOLDER, FOLDER2, IMAGE_ITEM_CHILD];

describe('Move Item in Grid', () => {
  it('move item from Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);
    cy.switchMode(ItemLayoutMode.Grid);

    // move
    const { id: movedItem } = FOLDER2;
    const { id: toItem, path: toItemPath } = FOLDER;
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item from item', () => {
    cy.setUpApi({ items });

    // go to children item
    cy.visit(buildItemPath(FOLDER.id));
    cy.switchMode(ItemLayoutMode.Grid);

    // move
    const { id: movedItem } = IMAGE_ITEM_CHILD;
    const { id: toItem, path: toItemPath } = FOLDER2;
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item to Home', () => {
    cy.setUpApi({ items });

    // go to children item
    cy.visit(buildItemPath(FOLDER.id));
    cy.switchMode(ItemLayoutMode.Grid);

    // move
    const { id: movedItem } = IMAGE_ITEM_CHILD;
    moveItem({ id: movedItem, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      expect(url).to.contain(movedItem);
    });
  });
});
