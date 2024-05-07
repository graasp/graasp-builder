import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID,
  MY_GRAASP_ITEM_PATH,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';

const moveItems = ({
  itemIds,
  toItemPath,
}: {
  itemIds: string[];
  toItemPath: string;
}) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} input`).click();
  });

  cy.get(`#${ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID}`).click();
  cy.handleTreeMenu(toItemPath);
};

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const IMAGE_ITEM_CHILD2 = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER_CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();
const FOLDER3 = PackedFolderItemFactory();

const items = [
  IMAGE_ITEM,
  FOLDER,
  FOLDER3,
  FOLDER2,
  IMAGE_ITEM_CHILD,
  IMAGE_ITEM_CHILD2,
  FOLDER_CHILD,
];

describe('Move Items in List', () => {
  it('Move items on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // move
    const itemIds = [FOLDER3.id, FOLDER2.id];
    const { id: toItem, path: toItemPath } = FOLDER;
    moveItems({ itemIds, toItemPath });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      itemIds.forEach((movedItem) => expect(url).to.contain(movedItem));
    });
  });

  it('Move items in item', () => {
    cy.setUpApi({ items });
    const { id: start } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(start));

    cy.switchMode(ItemLayoutMode.List);

    // move
    const itemIds = [IMAGE_ITEM_CHILD.id, IMAGE_ITEM_CHILD2.id];
    const { id: toItem, path: toItemPath } = FOLDER_CHILD;
    moveItems({ itemIds, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      itemIds.forEach((movedItem) => expect(url).to.contain(movedItem));
    });
  });

  it('Move items to Home', () => {
    cy.setUpApi({ items });
    const { id: start } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(start));

    cy.switchMode(ItemLayoutMode.List);

    // move
    const itemIds = [IMAGE_ITEM_CHILD.id, IMAGE_ITEM_CHILD2.id];
    moveItems({ itemIds, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      itemIds.forEach((movedItem) => expect(url).to.contain(movedItem));

      // TODO: this is still selected if we do not get the feedbacks
      // commenting it for now, but should be fixed in the future
      // itemIds.forEach((id) => {
      //   cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('not.exist');
      // });
    });
  });
});
