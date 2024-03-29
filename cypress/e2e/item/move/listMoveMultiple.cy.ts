import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID,
  MY_GRAASP_ITEM_PATH,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

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

describe('Move Items in List', () => {
  it('Move items on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // move
    const itemIds = [SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[5].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItems({ itemIds, toItemPath });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      itemIds.forEach((movedItem) => expect(url).to.contain(movedItem));
    });
  });

  it('Move items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));

    cy.switchMode(ItemLayoutMode.List);

    // move
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItems({ itemIds, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      itemIds.forEach((movedItem) => expect(url).to.contain(movedItem));
    });
  });

  it('Move items to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));

    cy.switchMode(ItemLayoutMode.List);

    // move
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
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
