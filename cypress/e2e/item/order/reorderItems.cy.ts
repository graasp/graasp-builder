import { buildItemPath } from '../../../../src/config/paths';
import {
  ROW_DRAGGER_CLASS,
  buildItemsTableId,
  buildItemsTableRowId,
  buildItemsTableRowSelector,
} from '../../../../src/config/selectors';
import { ITEM_REORDER_ITEMS } from '../../../fixtures/items';
import { ROW_HEIGHT } from '../../../support/constants';

const reorderAndCheckItem = (id, currentPosition, newPosition) => {
  const dragIcon = `${buildItemsTableRowSelector(
    id,
  )} .${ROW_DRAGGER_CLASS} svg`;

  cy.wait([
    '@getItem',
    '@getChildren',
    '@getItemMemberships',
  ]);

  cy.dragAndDrop(dragIcon, 0, (newPosition - currentPosition) * ROW_HEIGHT);

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
        items: [ITEM_REORDER_ITEMS.parent, ...ITEM_REORDER_ITEMS.children],
      });

      cy.visit(buildItemPath(ITEM_REORDER_ITEMS.parent.id));

      const tableBody = `#${buildItemsTableId(ITEM_REORDER_ITEMS.parent.id)}`;

      ITEM_REORDER_ITEMS.children.forEach(({ id }, index) => {
        // this will find multiple row instances because ag-grid renders several
        // this should be okay as all of them should have the same row-index
        cy.get(tableBody)
          .find(`[row-id=${buildItemsTableRowId(id)}]`)
          .should('have.attr', 'row-index', index);
      });
    });
  });
});
