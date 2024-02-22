import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  MY_GRAASP_ITEM_PATH,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

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
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    const itemIds = [SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[5].id];
    const { path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItems({ itemIds, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      itemIds.forEach((id) => {
        expect(url).to.contain(id);
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });
    });
  });

  it('Copy items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
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
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));
    cy.switchMode(ItemLayoutMode.List);

    // copy
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    copyItems({ itemIds, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      itemIds.forEach((id) => {
        expect(url).to.contain(id);
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });
    });
  });
});
