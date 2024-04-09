import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  MY_GRAASP_ITEM_PATH,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const IMAGE_ITEM_CHILD2 = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();
const FOLDER3 = PackedFolderItemFactory();

const items = [
  IMAGE_ITEM,
  FOLDER,
  FOLDER2,
  FOLDER3,
  IMAGE_ITEM_CHILD,
  IMAGE_ITEM_CHILD2,
];

const copyItems = ({
  itemIds,
  toItemPath,
  rootId,
}: {
  itemIds: string[];
  toItemPath: string;
  rootId?: string;
}) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.get(`${buildItemsTableRowIdAttribute(id)} input`).click();
  });

  cy.get(`#${ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

describe('Copy items in List', () => {
  it('Copy items on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    const itemIds = [FOLDER2.id, FOLDER3.id];
    const { path: toItemPath } = FOLDER;
    copyItems({ itemIds, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      itemIds.forEach((id) => {
        expect(url).to.contain(id);
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });
    });
  });

  it('Copy items in item', () => {
    cy.setUpApi({ items });
    const { id: start } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(start));
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const itemIds = [IMAGE_ITEM_CHILD.id, IMAGE_ITEM_CHILD2.id];
    const { id: toItem, path: toItemPath } = FOLDER2;
    copyItems({ itemIds, toItemPath });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      itemIds.forEach((id) => {
        expect(url).to.contain(id);
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });
    });
  });

  it('Copy items to Home', () => {
    cy.setUpApi({ items });
    const { id: start } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(start));
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const itemIds = [IMAGE_ITEM_CHILD.id, IMAGE_ITEM_CHILD2.id];
    copyItems({ itemIds, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      itemIds.forEach((id) => {
        expect(url).to.contain(id);
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });
    });
  });
});
