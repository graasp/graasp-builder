import { buildItemPath } from '../../../../src/config/paths';
import { ITEM_REORDER_ITEMS, ORDERED_ITEMS } from '../../../fixtures/items';
import {
  buildItemsTableRowId,
  ITEMS_TABLE_BODY,
} from '../../../../src/config/selectors';
import { ROW_HEIGHT } from '../../../support/constants';

const reorderAndCheckItem = (id, currentPosition, newPosition) => {
  const childEl = `#${buildItemsTableRowId(id)}`;

  cy.dragAndDrop(childEl, 0, (newPosition - currentPosition) * ROW_HEIGHT);

  cy.wait('@editItem').then(
    ({
      response: {
        body: { extra },
      },
    }) => {
      expect(extra.folder.childrenOrder[newPosition]).to.equal(id);
    },
  );
};

describe('Order Items', () => {
  describe('Move Item', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [ITEM_REORDER_ITEMS.parent, ...ITEM_REORDER_ITEMS.children],
      });
      cy.visit(buildItemPath(ITEM_REORDER_ITEMS.parent.id));
    });

    it('move item to a spot below', () => {
      const currentPosition = 0;
      const newPosition = 1;

      const { id: childId } = ITEM_REORDER_ITEMS.children[currentPosition];

      reorderAndCheckItem(childId, currentPosition, newPosition);
    });

    it('move first item to last spot', () => {
      const currentPosition = 0;
      const newPosition = 2;

      const { id: childId } = ITEM_REORDER_ITEMS.children[currentPosition];

      reorderAndCheckItem(childId, currentPosition, newPosition);
    });

    it('move middle item to top spot', () => {
      const currentPosition = 1;
      const newPosition = 0;

      const { id: childId } = ITEM_REORDER_ITEMS.children[currentPosition];

      reorderAndCheckItem(childId, currentPosition, newPosition);
    });
  });

  describe('Check Order', () => {
    it('check item order in folder with non-existing item in ordering', () => {
      cy.setUpApi({
        items: [ORDERED_ITEMS.parent, ...ORDERED_ITEMS.children],
      });

      cy.visit(buildItemPath(ORDERED_ITEMS.parent.id));

      const tableBody = `#${ITEMS_TABLE_BODY}`;

      ORDERED_ITEMS.existingChildrenOrder.forEach((id, index) => {
        cy.get(tableBody)
          .children()
          .eq(index)
          .should('have.id', buildItemsTableRowId(id));
      });
    });
  });
});
