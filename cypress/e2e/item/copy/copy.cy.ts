import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_COPY_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemCard,
  buildItemsGridMoreButtonSelector,
} from '../../../../src/config/selectors';

const copyItem = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  cy.get(buildItemsGridMoreButtonSelector(id)).click();
  cy.get(`.${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();
const IMAGE_ITEM_CHILD = PackedLocalFileItemFactory({ parentItem: FOLDER });
const FOLDER2 = PackedFolderItemFactory();

const items = [IMAGE_ITEM, FOLDER, FOLDER2, IMAGE_ITEM_CHILD];

describe('Copy Item', () => {
  it('copy item on Home', () => {
    cy.setUpApi({ items });
    cy.visit(HOME_PATH);

    // copy
    const { id: copyItemId } = FOLDER;
    copyItem({ id: copyItemId, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('be.visible');
      expect(url).to.contain(copyItemId);
    });
  });

  it('copy item in item', () => {
    cy.setUpApi({ items });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // copy
    const { id: copyItemId } = IMAGE_ITEM_CHILD;
    const { id: toItemId, path: toItemPath } = FOLDER2;
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');
      expect(url).to.contain(copyItemId);
      expect(body.parentId).to.equal(toItemId);
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi({ items });

    // go to children item
    cy.visit(buildItemPath(FOLDER.id));

    // copy
    const { id } = IMAGE_ITEM_CHILD;
    const toItemPath = MY_GRAASP_ITEM_PATH;
    copyItem({ id, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      cy.get(`#${buildItemCard(id)}`).should('exist');
      expect(url).to.contain(id);
    });
  });
});
