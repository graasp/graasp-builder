import { buildItemPath } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  ITEM_SEARCH_INPUT_ID,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

describe('Search Item in Table', () => {
  const { id } = SAMPLE_ITEMS.items[0];
  const child3 = SAMPLE_ITEMS.items.find((it) => it.name === 'own_item_name3');
  const child4 = SAMPLE_ITEMS.items.find((it) => it.name === 'own_item_name4');

  beforeEach(() => {
    cy.setUpApi(SAMPLE_ITEMS);
  });

  it('searches in list successfully', () => {
    // visit child
    cy.visit(buildItemPath(id));

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`[ row-id = "${buildItemsTableRowId(item.id)}"]`).should(
          'exist',
        );
      }
    });

    // perform search
    cy.get(`#${ITEM_SEARCH_INPUT_ID}`)
      .type(child3.name)
      .then(() => {
        // should find child3 but not child4
        cy.get(`[ row-id = "${buildItemsTableRowId(child3.id)}"]`).should(
          'exist',
        );
        cy.get(`[ row-id = "${buildItemsTableRowId(child4.id)}"]`).should(
          'not.exist',
        );
      });

    // erase search
    cy.get(`#${ITEM_SEARCH_INPUT_ID}`)
      .clear()
      .then(() => {
        // should find all children again
        cy.get(`[ row-id = "${buildItemsTableRowId(child3.id)}"]`).should(
          'exist',
        );
        cy.get(`[ row-id = "${buildItemsTableRowId(child4.id)}"]`).should(
          'exist',
        );
      });
  });
});
