import { buildItemPath } from '../../../../src/config/paths';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { buildItemsTableRowId } from '../../../../src/config/selectors';

describe('Order Items', () => {
  it('move item to a spot below', () => {
    cy.setUpApi(SAMPLE_ITEMS);

    const { id: parentId } = SAMPLE_ITEMS.items[0];

    cy.visit(buildItemPath(parentId));

    const { id: childId } = SAMPLE_ITEMS.items[2];

    const childEl = `#${buildItemsTableRowId(childId)}`;

    cy.dragAndDrop(childEl, 0, 500);

    cy.wait('@editItem').then(
      ({
        response: {
          body: { extra },
        },
      }) => {
        expect(extra.folder.childrenOrder[1]).to.equal(childId);
      },
    );
  });
});
