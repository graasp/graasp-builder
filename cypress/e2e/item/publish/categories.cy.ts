import { CategoryType } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  LIBRARY_SETTINGS_CATEGORIES_ID,
  buildCategoryDropdownParentSelector,
  buildCategorySelectionId,
  buildCategorySelectionOptionId,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CATEGORIES,
  ITEM_WITH_CATEGORIES_CONTEXT,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { PUBLISH_TAB_LOADING_TIME } from '../../../support/constants';

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
  cy.wait(PUBLISH_TAB_LOADING_TIME);
};

const toggleOption = (id, categoryType) => {
  cy.get(`#${buildCategorySelectionId(categoryType)}`).click();

  cy.get(`#${buildCategorySelectionOptionId(categoryType, id)}`).click();
};

describe('Categories', () => {
  describe('Item without category', () => {
    it('Display item without category', () => {
      const item = { ...ITEM_WITH_CATEGORIES, categories: [] };
      cy.setUpApi({ items: [item] });
      cy.visit(buildItemPath(item.id));
      openPublishItemTab(item.id);

      // check for not displaying if no categories
      cy.get(`#${LIBRARY_SETTINGS_CATEGORIES_ID} .MuiChip-label`).should(
        'not.exist',
      );
    });
  });

  describe('Item with category', () => {
    const item = ITEM_WITH_CATEGORIES;
    beforeEach(() => {
      cy.setUpApi(ITEM_WITH_CATEGORIES_CONTEXT);
      cy.visit(buildItemPath(item.id));
      openPublishItemTab(item.id);
    });

    it('Display item category', () => {
      // check for displaying value
      const {
        categories: [{ category }],
      } = item;
      const { name } = SAMPLE_CATEGORIES.find(({ id }) => id === category.id);
      const categoryContent = cy.get(`#${LIBRARY_SETTINGS_CATEGORIES_ID}`);
      categoryContent.contains(name);
    });

    describe('Delete a category', () => {
      it('Using Dropdown', () => {
        const {
          categories: [itemCategory],
        } = item;
        const { category, id } = itemCategory;
        const categoryType = SAMPLE_CATEGORIES.find(
          ({ id: cId }) => cId === category.id,
        )?.type;
        toggleOption(category.id, categoryType);
        cy.wait('@deleteItemCategory').then((data) => {
          const {
            request: { url },
          } = data;
          expect(url.split('/')).contains(id);
        });
      });

      it('Using cross on category tag', () => {
        const {
          categories: [itemCategory],
        } = item;
        const { category, id } = itemCategory;
        const categoryType = SAMPLE_CATEGORIES.find(
          ({ id: cId }) => cId === category.id,
        )?.type;
        cy.get(`[data-cy=${buildCategoryDropdownParentSelector(categoryType)}]`)
          .find(`[data-tag-index=0] > svg`)
          .click();
        cy.wait('@deleteItemCategory').then((data) => {
          const {
            request: { url },
          } = data;
          expect(url.split('/')).contains(id);
        });
      });

      it('Using backspace in textfield', () => {
        const {
          categories: [itemCategory],
        } = item;
        const { category, id } = itemCategory;
        const categoryType = SAMPLE_CATEGORIES.find(
          ({ id: cId }) => cId === category.id,
        )?.type;
        cy.get(
          `[data-cy=${buildCategoryDropdownParentSelector(
            categoryType,
          )}] input`,
        ).type('{backspace}');
        cy.wait('@deleteItemCategory').then((data) => {
          const {
            request: { url },
          } = data;
          expect(url.split('/')).contains(id);
        });
      });
    });

    it('Add a category', () => {
      const { type, id } = SAMPLE_CATEGORIES[1];
      toggleOption(id, type);
      cy.wait('@postItemCategory').then((data) => {
        const {
          request: { url },
        } = data;
        expect(url.split('/')).contains(item.id);
      });
    });
  });

  // users without permission will not see the sections
  describe('Categories permissions', () => {
    it('User signed out cannot edit category level', () => {
      const item = PUBLISHED_ITEM;
      cy.setUpApi({
        items: [item],
        currentMember: SIGNED_OUT_MEMBER,
      });
      cy.visit(buildItemPath(item.id));

      // signed out user should not be able to see the publish button
      cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
      cy.get(`#${buildCategorySelectionId(CategoryType.Level)}`).should(
        'not.exist',
      );
    });

    it('Read-only user cannot edit category level', () => {
      const item = PUBLISHED_ITEM;
      cy.setUpApi({
        items: [item],
        currentMember: MEMBERS.BOB,
      });
      cy.visit(buildItemPath(item.id));

      // signed out user should not be able to see the publish button
      cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
      cy.get(`#${buildCategorySelectionId(CategoryType.Level)}`).should(
        'not.exist',
      );
    });
  });
});
