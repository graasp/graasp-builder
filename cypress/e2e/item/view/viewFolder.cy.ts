import i18n from '../../../../src/config/i18n';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_SEARCH_INPUT_ID,
  NAVIGATION_HOME_ID,
  buildItemCard,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { CURRENT_USER } from '../../../fixtures/members';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';
import { expectFolderViewScreenLayout } from '../../../support/viewUtils';

describe('View Folder', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          ...SAMPLE_ITEMS.items,
          ...SHARED_ITEMS.items,
          GRAASP_LINK_ITEM,
          IMAGE_ITEM_DEFAULT,
          VIDEO_ITEM_S3,
        ],
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
    });

    it('visit item by id', () => {
      const { id } = SAMPLE_ITEMS.items[0];
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.Grid);

      // should get current item
      cy.wait('@getItem');

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check all children are created and displayed
        for (const item of body) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
      expectFolderViewScreenLayout({ item: SAMPLE_ITEMS.items[0] });

      // visit home
      cy.get(`#${NAVIGATION_HOME_ID}`).click();

      // should get accessible items
      cy.wait('@getAccessibleItems').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body.data) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
    });

    it('search', () => {
      const { id } = SAMPLE_ITEMS.items[0];
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.Grid);

      cy.get(`#${buildItemCard(SAMPLE_ITEMS.items[2].id)}`).should(
        'be.visible',
      );
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(SAMPLE_ITEMS.items[3].name);
      cy.get(`#${buildItemCard(SAMPLE_ITEMS.items[3].id)}`).should(
        'be.visible',
      );
    });
  });

  describe('List', () => {
    const allItems = [
      ...SAMPLE_ITEMS.items,
      GRAASP_LINK_ITEM,
      IMAGE_ITEM_DEFAULT,
      VIDEO_ITEM_S3,
    ];
    beforeEach(() => {
      cy.setUpApi({
        items: allItems,
      });
    });

    describe('Navigation', () => {
      it('visit folder by id', () => {
        const { id } = SAMPLE_ITEMS.items[0];
        cy.visit(buildItemPath(id));

        cy.switchMode(ItemLayoutMode.List);

        // should get current item
        cy.wait('@getItem');
        // should get children
        cy.wait('@getChildren').then(({ response: { body } }) => {
          // check all children are created and displayed
          for (const item of body) {
            cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
          }
        });

        expectFolderViewScreenLayout({ item: SAMPLE_ITEMS.items[0] });
        // visit home
        cy.get(`#${NAVIGATION_HOME_ID}`).click();

        cy.wait('@getAccessibleItems').then(({ response: { body } }) => {
          // check item is created and displayed
          for (const item of body.data) {
            cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
          }
        });
      });
    });

    it('search', () => {
      const { id } = SAMPLE_ITEMS.items[0];
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.List);

      cy.get(buildItemsTableRowIdAttribute(SAMPLE_ITEMS.items[2].id)).should(
        'be.visible',
      );
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(SAMPLE_ITEMS.items[3].name);
      cy.get(buildItemsTableRowIdAttribute(SAMPLE_ITEMS.items[3].id)).should(
        'be.visible',
      );
    });
  });
});
