import {
  ITEM_LAYOUT_MODES,
  DEFAULT_ITEM_LAYOUT_MODE,
} from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM, INVALID_LINK_ITEM } from '../../../fixtures/links';
import { CREATE_ITEM_PAUSE } from '../../../support/constants';
import { createItem } from './utils';

describe('Create Link', () => {
  it('create link on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(GRAASP_LINK_ITEM, { mode: ITEM_LAYOUT_MODES.LIST });

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.wait(CREATE_ITEM_PAUSE);
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  it('create space in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // create
    createItem(GRAASP_LINK_ITEM, { mode: ITEM_LAYOUT_MODES.LIST });

    cy.wait('@postItem').then(({ response: { body } }) => {
      // check item is created and displayed
      cy.get(`#${buildItemsTableRowId(body.id)}`).should('exist');
    });
  });

  describe('Errors handling', () => {
    it('cannot add an invalid link', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS });
      const { id } = SAMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // create
      createItem(INVALID_LINK_ITEM, {
        mode: ITEM_LAYOUT_MODES.LIST,
        confirm: false,
      });

      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
        'have.prop',
        'disabled',
        true,
      );
    });
  });
});
