import { ItemType } from '@graasp/sdk';

import * as qs from 'qs';

import { HOME_PATH } from '../../../../src/config/paths';
import {
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { buildShortcutExtra } from '../../../../src/utils/itemExtra';
import { IMAGE_ITEM_DEFAULT } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const createShortcut = ({
  id,
  toItemPath,
}: {
  id: string;
  toItemPath: string;
}) => {
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_SHORTCUT_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemPath);
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
}: {
  id: string;
  toItemPath?: string;
}) => {
  // cy.wait(TABLE_ITEM_RENDER_TIME);
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  createShortcut({ id, toItemPath });
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
      expect(url).to.include(qs.stringify({ parentId: toItemId }));
    } else {
      expect(url).to.not.include('parentId');
      cy.wait('@getAccessibleItems');
    }
  });
};

describe('Create Shortcut', () => {
  describe('List', () => {
    it('create shortcut from Home to Home', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);

      const { id } = SAMPLE_ITEMS.items[0];
      // toItemId: TREE_MODAL_MY_ITEMS_ID
      createShortcutInList({ id });

      checkCreateShortcutRequest({ id });
    });

    it('create shortcut from Home to Item', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);

      const { id } = SAMPLE_ITEMS.items[0];
      const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
      createShortcutInList({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });

    it('create shortcut from Item to Item', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);

      const { id } = SAMPLE_ITEMS.items[1];
      const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
      createShortcutInList({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });

    it('create shortcut from file to Item', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);

      const { id } = IMAGE_ITEM_DEFAULT;
      const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
      createShortcutInList({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });
  });
  describe('Grid', () => {
    it('create shortcut from Home to Home', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const { id } = SAMPLE_ITEMS.items[0];
      // toItemId: TREE_MODAL_MY_ITEMS_ID
      createShortcutInGrid({ id });

      checkCreateShortcutRequest({ id });
    });

    it('create shortcut from Home to Item', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const { id } = SAMPLE_ITEMS.items[0];
      const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
      createShortcutInGrid({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });

    it('create shortcut from Item to Item', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const { id } = SAMPLE_ITEMS.items[1];
      const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
      createShortcutInGrid({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });

    it('create shortcut from file to Item', () => {
      cy.setUpApi({ items: [...SAMPLE_ITEMS.items, IMAGE_ITEM_DEFAULT] });
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const { id } = IMAGE_ITEM_DEFAULT;
      const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
      createShortcutInGrid({ id, toItemPath });

      checkCreateShortcutRequest({ id, toItemId });
    });
  });
});
