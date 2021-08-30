import {
    ROOT_ID,
    DEFAULT_ITEM_LAYOUT_MODE,
  } from '../../../../src/config/constants';
  import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
  import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
  import {
    buildItemsTableRowId,
    ITEMS_TABLE_ROW_CHECKBOX_CLASS,
    ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID
  } from '../../../../src/config/selectors';
  import { SAMPLE_ITEMS } from '../../../fixtures/items';
  import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';
  
const moveItems = ({ itemIds, toItemPath }) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.wait(TABLE_ITEM_RENDER_TIME);
    cy.get(
      `#${buildItemsTableRowId(id)} .${ITEMS_TABLE_ROW_CHECKBOX_CLASS}`,
    ).click();
  });

  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(`#${ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID}`).click();
  cy.fillTreeModal(toItemPath);
};
  
describe('Move Items in List', () => {
  it('Move items on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }
  
    // move
    const itemIds = [SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[5].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItems({ itemIds, toItemPath });
  
    cy.wait('@moveItems').then(({ request: { url, body } }) => {
        expect(body.parentId).to.equal(toItem);
        itemIds.forEach(movedItem => expect(url).to.contain(movedItem));

        itemIds.forEach(id => {
          cy.get(`#${buildItemsTableRowId(id)}`).should('not.exist');
        });
    });
  });
  
  it('Move items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // move
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    moveItems({ itemIds, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      itemIds.forEach(movedItem => expect(url).to.contain(movedItem));
      itemIds.forEach(id => {
        cy.get(`#${buildItemsTableRowId(id)}`).should('not.exist');
      });
    });
  });

  it('Move items to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id: start } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(start));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // move
    const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
    const toItem = ROOT_ID;
    moveItems({ itemIds, toItemPath: toItem });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      itemIds.forEach(movedItem => expect(url).to.contain(movedItem));
      
      itemIds.forEach(id => {
        cy.get(`#${buildItemsTableRowId(id)}`).should('not.exist');
      });
    });
  });
  
  describe('Error handling', () => {
    it('error while moving items does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, moveItemsError: true });
      const { id: start } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(start));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // move
      const itemIds = [SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[4].id];
      const { path: toItemPath } = SAMPLE_ITEMS.items[3];
      moveItems({ itemIds, toItemPath });

      cy.wait('@moveItems').then(() => {
        // check item is still there
        itemIds.forEach(id => {
          cy.get(`#${buildItemsTableRowId(id)}`).should('exist');
        });
      });
    });
  });
});
  