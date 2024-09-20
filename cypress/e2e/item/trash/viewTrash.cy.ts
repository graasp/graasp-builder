import {
  GuestFactory,
  ItemLoginSchemaFactory,
  PackedFolderItemFactory,
  PackedRecycledItemDataFactory,
} from '@graasp/sdk';

import { SortingOptions } from '@/components/table/types';
import { BUILDER } from '@/langs/constants';

import i18n, { BUILDER_NAMESPACE } from '../../../../src/config/i18n';
import { RECYCLE_BIN_PATH } from '../../../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  ITEM_SEARCH_INPUT_ID,
  PREVENT_GUEST_MESSAGE_ID,
  RECYCLED_ITEMS_ERROR_ALERT_ID,
  RECYCLED_ITEMS_ROOT_CONTAINER,
  SORTING_ORDERING_SELECTOR_ASC,
  SORTING_ORDERING_SELECTOR_DESC,
  SORTING_SELECT_SELECTOR,
  buildItemCard,
} from '../../../../src/config/selectors';
import { CURRENT_USER } from '../../../fixtures/members';

const recycledItemData = [
  PackedRecycledItemDataFactory(),
  PackedRecycledItemDataFactory(),
  PackedRecycledItemDataFactory(),
];

describe('View trash', () => {
  it('Show message for guest', () => {
    const item = PackedFolderItemFactory();
    const guest = GuestFactory({
      itemLoginSchema: ItemLoginSchemaFactory({ item }),
    });
    cy.setUpApi({ items: [item], currentMember: guest });
    cy.visit(RECYCLE_BIN_PATH);
    cy.get(`#${PREVENT_GUEST_MESSAGE_ID}`).should('be.visible');
  });

  describe('Member has no recycled items', () => {
    it('Show empty table', () => {
      cy.setUpApi({
        items: recycledItemData.map(({ item }) => item),
      });
      cy.visit(RECYCLE_BIN_PATH);
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      const text = i18n.t(BUILDER.TRASH_NO_ITEM, { ns: BUILDER_NAMESPACE });
      cy.get(`#${RECYCLED_ITEMS_ROOT_CONTAINER}`).should('contain', text);
    });
  });

  describe('Member has recycled items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: recycledItemData.map(({ item }) => item),
        recycledItemData,
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      cy.visit(RECYCLE_BIN_PATH);
    });

    it('Empty search', () => {
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
      const searchText = 'mysearch';
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);
      const text = i18n.t(BUILDER.TRASH_NO_ITEM_SEARCH, {
        search: searchText,
        ns: BUILDER_NAMESPACE,
      });
      cy.get(`#${RECYCLED_ITEMS_ROOT_CONTAINER}`).should('contain', text);
    });

    it('New button should not exist', () => {
      cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');
    });

    it('check recycled item layout', () => {
      for (const { item } of recycledItemData) {
        cy.get(`#${buildItemCard(item.id)}`).should('be.visible');
      }
    });

    it('Sorting & Ordering', () => {
      cy.get(`${SORTING_SELECT_SELECTOR} input`).should(
        'have.value',
        SortingOptions.ItemUpdatedAt,
      );
      cy.get(SORTING_ORDERING_SELECTOR_DESC).should('be.visible');

      cy.get(SORTING_SELECT_SELECTOR).click();
      cy.get('li[data-value="item.name"]').click();

      // check items are ordered by name
      cy.get(`#${RECYCLED_ITEMS_ROOT_CONTAINER} h5`).then(($e) => {
        recycledItemData.sort((a, b) => (a.item.name < b.item.name ? 1 : -1));
        for (let idx = 0; idx < recycledItemData.length; idx += 1) {
          expect($e[idx].innerText).to.eq(recycledItemData[idx].item.name);
        }
      });

      // change ordering
      cy.get(SORTING_ORDERING_SELECTOR_DESC).click();
      cy.get(SORTING_ORDERING_SELECTOR_ASC).should('be.visible');
      cy.get(`#${RECYCLED_ITEMS_ROOT_CONTAINER} h5`).then(($e) => {
        recycledItemData.reverse();
        for (let idx = 0; idx < recycledItemData.length; idx += 1) {
          expect($e[idx].innerText).to.eq(recycledItemData[idx].item.name);
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('check recycled item layout with server error', () => {
      cy.setUpApi({
        items: recycledItemData.map(({ item }) => item),
        recycledItemData,
        getRecycledItemsError: true,
      });
      cy.visit(RECYCLE_BIN_PATH);

      cy.get(`#${RECYCLED_ITEMS_ERROR_ALERT_ID}`).should('exist');
    });
  });
});
