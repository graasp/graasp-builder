import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_COPY_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';

const copyItem = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  // I need this wait because the table reloads and I lose the menu
  // todo: remove on table refactor
  cy.wait(500);
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();

const items = [IMAGE_ITEM, FOLDER, FOLDER2, IMAGE_ITEM_CHILD];

describe('Copy Item in List', () => {
  it('copy item on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const { id: copyItemId } = IMAGE_ITEM;
    copyItem({ id: copyItemId, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(copyItemId);
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const { id: copyItemId } = IMAGE_ITEM_CHILD;
    const { id: toItem, path: toItemPath } = FOLDER2;
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(url).to.contain(copyItemId);
      expect(body.parentId).to.contain(toItem);
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const { id: copyItemId } = IMAGE_ITEM_CHILD;
    copyItem({ id: copyItemId, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(copyItemId);

      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });
});
