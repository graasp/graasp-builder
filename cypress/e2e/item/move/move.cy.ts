import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemsGridMoreButtonSelector,
  buildNavigationModalItemId,
} from '../../../../src/config/selectors';

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
const CHILD_CHILD = PackedFolderItemFactory({ parentItem: CHILD });
const FOLDER2 = PackedFolderItemFactory();

const items = [IMAGE_ITEM, FOLDER, FOLDER2, CHILD, CHILD_CHILD];

const openMoveModal = ({ id: movedItemId }: { id: string }) => {
  cy.get(buildItemsGridMoreButtonSelector(movedItemId)).click();
  cy.get(`.${ITEM_MENU_MOVE_BUTTON_CLASS}`).click();
};

const moveItems = ({
  toItemPath,
  rootId,
}: {
  toItemPath: string;
  rootId?: string;
}) => {
  cy.get(`[data-testid="OpenWithIcon"]`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

const moveItem = ({
  id: movedItemId,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  openMoveModal({ id: movedItemId });
  cy.handleTreeMenu(toItemPath, rootId);
};

describe('Move Items', () => {
  it('move item on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    // move
    const { id: movedItem } = FOLDER2;
    const { id: toItem, path: toItemPath } = FOLDER;
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item in item', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = CHILD;
    const { id: toItem, path: toItemPath } = FOLDER2;
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('cannot move inside self children', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    const { id: movedItemId } = CHILD;
    const { id: parentId } = FOLDER;
    const { id: childId } = CHILD_CHILD;

    openMoveModal({ id: movedItemId });

    // parent is disabled
    cy.get(`#${buildNavigationModalItemId(parentId)} button`).should(
      'be.disabled',
    );
    cy.clickTreeMenuItem(parentId);

    // self is disabled
    cy.get(`#${buildNavigationModalItemId(movedItemId)} button`).should(
      'be.disabled',
    );
    cy.clickTreeMenuItem(movedItemId);

    // inner child is disabled
    cy.get(`#${buildNavigationModalItemId(childId)} button`).should(
      'be.disabled',
    );
  });

  it('move item to Home', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // move
    const { id: movedItem } = CHILD;
    moveItem({ id: movedItem, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      expect(url).to.contain(movedItem);
    });
  });

  it('move many items from Home to folder', () => {
    const folders = [
      PackedFolderItemFactory(),
      PackedFolderItemFactory(),
      PackedFolderItemFactory(),
    ];
    const toItem = PackedFolderItemFactory();
    cy.setUpApi({
      items: [...folders, toItem],
    });

    // go to children item
    cy.visit('/');

    folders.forEach((item) => {
      cy.selectItem(item.id);
    });

    moveItems({ toItemPath: toItem.path });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.eq(toItem.id);
      folders.forEach((item) => {
        expect(url).to.contain(item.id);
      });
    });
  });

  it('move many items from folder to folder', () => {
    const parentItem = PackedFolderItemFactory();
    const folders = [
      PackedFolderItemFactory({ parentItem }),
      PackedFolderItemFactory({ parentItem }),
      PackedFolderItemFactory({ parentItem }),
    ];
    const toItem = PackedFolderItemFactory();
    cy.setUpApi({
      items: [...folders, parentItem, toItem],
    });

    // go to children item
    cy.visit(buildItemPath(parentItem.id));

    folders.forEach((item) => {
      cy.selectItem(item.id);
    });

    moveItems({ toItemPath: toItem.path });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.eq(toItem.id);
      folders.forEach((item) => {
        expect(url).to.contain(item.id);
      });
    });
  });

  it('move many items from folder to Home', () => {
    const parentItem = PackedFolderItemFactory();
    const folders = [
      PackedFolderItemFactory({ parentItem }),
      PackedFolderItemFactory({ parentItem }),
      PackedFolderItemFactory({ parentItem }),
    ];
    cy.setUpApi({
      items: [...folders, parentItem],
    });

    // go to children item
    cy.visit(buildItemPath(parentItem.id));

    folders.forEach((item) => {
      cy.selectItem(item.id);
    });

    moveItems({ toItemPath: '' });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      // eslint-disable-next-line no-unused-expressions
      expect(body.parentId).to.be.undefined;
      folders.forEach((item) => {
        expect(url).to.contain(item.id);
      });
    });
  });
});
