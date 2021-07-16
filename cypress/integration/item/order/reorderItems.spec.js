import { buildItemPath } from '../../../../src/config/paths';
import { ITEM_REORDER_ITEMS } from '../../../fixtures/items';
import { buildRowDraggerId } from '../../../../src/config/selectors';
import { TABLE_ITEM_RENDER_TIME, ROW_HEIGHT } from '../../../support/constants';

const reorderAndCheckItem = (id, currentPosition, newPosition) => {
  const dragIcon = `#${buildRowDraggerId(id)}`;

  cy.wait(TABLE_ITEM_RENDER_TIME);
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
});
