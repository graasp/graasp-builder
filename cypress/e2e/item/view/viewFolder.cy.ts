import { PackedFolderItemFactory } from '@graasp/sdk';

import i18n from '../../../../src/config/i18n';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_SEARCH_INPUT_ID,
  NAVIGATION_HOME_ID,
  buildItemCard,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { CURRENT_USER } from '../../../fixtures/members';
import { expectFolderViewScreenLayout } from '../../../support/viewUtils';

const parentItem = PackedFolderItemFactory();
const item1 = PackedFolderItemFactory();

const child1 = PackedFolderItemFactory({ parentItem });
const child2 = PackedFolderItemFactory({ parentItem });
const children = [child1, child2];

const items = [parentItem, item1, child1, child2];

describe('View Folder', () => {
  describe('Grid', () => {
    beforeEach(() => {
      cy.setUpApi({
        items,
      });
      i18n.changeLanguage(CURRENT_USER.extra.lang as string);
    });

    it('visit item by id', () => {
      const { id } = parentItem;
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.Grid);

      // should get current item
      cy.wait('@getItem');

      // should get children
      cy.wait('@getChildren').then(() => {
        // check all children are created and displayed
        for (const item of children) {
          cy.get(`#${buildItemCard(item.id)}`).should('exist');
        }
      });
      expectFolderViewScreenLayout({ item: parentItem });

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
      const { id } = parentItem;
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.Grid);

      cy.get(`#${buildItemCard(child1.id)}`).should('be.visible');
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(child1.name);
      cy.get(`#${buildItemCard(child1.id)}`).should('be.visible');
    });
  });

  describe('List', () => {
    beforeEach(() => {
      cy.setUpApi({
        items,
      });
    });

    describe('Navigation', () => {
      it('visit folder by id', () => {
        const { id } = parentItem;
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

        expectFolderViewScreenLayout({ item: parentItem });
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
      const { id } = parentItem;
      cy.visit(buildItemPath(id));
      cy.switchMode(ItemLayoutMode.List);

      cy.get(buildItemsTableRowIdAttribute(child1.id)).should('be.visible');
      cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(child1.name);
      cy.get(buildItemsTableRowIdAttribute(child1.id)).should('be.visible');
    });
  });
});
