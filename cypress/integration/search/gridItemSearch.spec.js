import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../src/config/constants';
import { buildItemPath } from '../../../src/config/paths';
import {
  buildItemCard,
  ITEM_SEARCH_INPUT_ID,
} from '../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../src/enums';
import { SAMPLE_ITEMS } from '../../fixtures/items';

describe('Search Item in Grid', () => {
  const { id } = SAMPLE_ITEMS.items[0];
  const child3 = SAMPLE_ITEMS.items.find((it) => it.name === 'own_item_name3');
  const child4 = SAMPLE_ITEMS.items.find((it) => it.name === 'own_item_name4');

  beforeEach(() => {
    cy.setUpApi(SAMPLE_ITEMS);
  });

  it('searches in list successfully', () => {
    // visit child
    cy.visit(buildItemPath(id));
    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.GRID) {
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    }

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // perform search
    cy.get(`#${ITEM_SEARCH_INPUT_ID}`)
      .type(child3.name)
      .then(() => {
        // should find child3 but not child4
        cy.get(`#${buildItemCard(child3.id)}`).should('exist');
        cy.get(`#${buildItemCard(child4.id)}`).should('not.exist');
      });

    // erase search
    cy.get(`#${ITEM_SEARCH_INPUT_ID}`)
      .clear()
      .then(() => {
        // should find all children again
        cy.get(`#${buildItemCard(child3.id)}`).should('exist');
        cy.get(`#${buildItemCard(child4.id)}`).should('exist');
      });
  });
});
