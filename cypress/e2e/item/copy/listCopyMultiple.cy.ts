import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  TREE_MODAL_MY_ITEMS_ID,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const copyItems = ({
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

  cy.get(`#${ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}`).click();
  cy.fillTreeModal(toItemPath);
};

describe('Copy items in List', () => {
  it('Copy items on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

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
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

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
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    copyItems({ itemIds, toItemPath: TREE_MODAL_MY_ITEMS_ID });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      itemIds.forEach((id) => {
        expect(url).to.contain(id);
        cy.get(`${buildItemsTableRowIdAttribute(id)}`).should('exist');
      });
    });
  });
});
