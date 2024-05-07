import {
  ItemType,
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
  buildShortcutExtra,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();

const createShortcut = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_SHORTCUT_BUTTON_CLASS}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

const createShortcutInGrid = ({
  id,
  toItemPath,
}: {
  id: string;
  toItemPath?: string;
}) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  createShortcut({ id, toItemPath });
};

const createShortcutInList = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath?: string;
  rootId?: string;
}) => {
  // todo: remove on table refactor
  cy.wait(500);
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  createShortcut({ id, toItemPath, rootId });
};

const checkCreateShortcutRequest = ({
  id,
  toItemId,
}: {
  id: string;
  toItemId?: string;
}) => {
  cy.wait('@postItem').then(({ request: { body, url } }) => {
    // check post item request is correct

    expect(body.extra).to.eql(buildShortcutExtra(id));
    expect(body.type).to.eql(ItemType.SHORTCUT);

    if (toItemId) {
      const search = new URLSearchParams();
      search.set('parentId', toItemId);
      expect(url).to.include(search.toString());
    } else {
      expect(url).to.not.include('parentId');
      cy.wait('@getAccessibleItems');
    }
  });
};

describe('Create Shortcut', () => {
  describe('List', () => {
    it('create shortcut from Home to Home', () => {
      cy.setUpApi({ items: [IMAGE_ITEM] });
      cy.visit(HOME_PATH);

      const { id } = IMAGE_ITEM;
      createShortcutInList({ id, toItemPath: MY_GRAASP_ITEM_PATH });

      checkCreateShortcutRequest({ id });
    });

    it('create shortcut from Home to Item', () => {
      cy.setUpApi({ items: [FOLDER, IMAGE_ITEM] });
      cy.visit(HOME_PATH);

      const { id } = IMAGE_ITEM;
      const { id: toItemId, path: toItemPath } = FOLDER;
      createShortcutInList({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });

    it('create shortcut from Item to Item', () => {
      cy.setUpApi({ items: [FOLDER, FOLDER2, IMAGE_ITEM_CHILD] });
      cy.visit(buildItemPath(FOLDER.id));

      const { id } = IMAGE_ITEM_CHILD;
      const { id: toItemId, path: toItemPath } = FOLDER2;
      createShortcutInList({ id, toItemPath });
      checkCreateShortcutRequest({ id, toItemId });
    });
  });
  describe('Grid', () => {
    it('create shortcut from Home to Home', () => {
      cy.setUpApi({ items: [IMAGE_ITEM] });
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      const { id } = IMAGE_ITEM;
      createShortcutInGrid({ id, toItemPath: MY_GRAASP_ITEM_PATH });

      checkCreateShortcutRequest({ id });
    });

    it('create shortcut from Home to Item', () => {
      cy.setUpApi({ items: [FOLDER, IMAGE_ITEM] });
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      const { id } = IMAGE_ITEM;
      const { id: toItemId, path: toItemPath } = FOLDER;
      createShortcutInGrid({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });

    it('create shortcut from Item to Item', () => {
      cy.setUpApi({ items: [FOLDER, FOLDER2, IMAGE_ITEM_CHILD] });
      cy.visit(buildItemPath(FOLDER.id));
      cy.switchMode(ItemLayoutMode.Grid);

      const { id } = IMAGE_ITEM_CHILD;
      const { id: toItemId, path: toItemPath } = FOLDER2;
      createShortcutInGrid({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });
  });
});
