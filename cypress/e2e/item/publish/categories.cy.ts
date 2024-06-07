import { Category, CategoryType } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  CATEGORIES_ADD_BUTTON_HEADER,
  LIBRARY_SETTINGS_CATEGORIES_ID,
  MUI_CHIP_REMOVE_BTN,
  buildCategoryDropdownParentSelector,
  buildCategorySelectionId,
  buildCategorySelectionOptionId,
  buildDataCyWrapper,
  buildDataTestIdWrapper,
  buildPublishButtonId,
  buildPublishChip,
  buildPublishChipContainer,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CATEGORIES,
  ITEM_WITH_CATEGORIES_CONTEXT,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const CATEGORIES_DATA_CY = buildDataCyWrapper(
  buildPublishChipContainer(LIBRARY_SETTINGS_CATEGORIES_ID),
);

const openPublishItemTab = (id: string) =>
  cy.get(`#${buildPublishButtonId(id)}`).click();

const toggleOption = (
  id: string,
  categoryType: CategoryType | `${CategoryType}`,
) => {
  cy.get(`#${buildCategorySelectionId(categoryType)}`).click();
  cy.get(`#${buildCategorySelectionOptionId(categoryType, id)}`).click();
};

const openCategoriesModal = () => {
  cy.get(buildDataCyWrapper(CATEGORIES_ADD_BUTTON_HEADER)).click();
};

describe('Categories', () => {
  describe('Item without category', () => {
    beforeEach(() => {
      const item = { ...ITEM_WITH_CATEGORIES, categories: [] as Category[] };
      cy.setUpApi({ items: [item] });
      cy.visit(buildItemPath(item.id));
      openPublishItemTab(item.id);
    });

    it('Display item without category', () => {
      // check for not displaying if no categories
      cy.get(CATEGORIES_DATA_CY).should('not.exist');
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
      const categoryContent = cy.get(CATEGORIES_DATA_CY);
      categoryContent.contains(name);
    });

    describe('Delete a category', () => {
      let id: string;
      let category: Category;
      let categoryType: Category['type'];

      beforeEach(() => {
        const {
          categories: [itemCategory],
        } = item;
        ({ category, id } = itemCategory);
        categoryType = SAMPLE_CATEGORIES.find(
          ({ id: cId }) => cId === category.id,
        )?.type;
      });

      afterEach(() => {
        cy.wait('@deleteItemCategory').then((data) => {
          const {
            request: { url },
          } = data;
          expect(url.split('/')).contains(id);
        });
      });

      it('Using Dropdown in modal', () => {
        openCategoriesModal();
        toggleOption(category.id, categoryType);
      });

      it('Using cross on category tag in modal', () => {
        openCategoriesModal();

        cy.get(
          buildDataCyWrapper(buildCategoryDropdownParentSelector(categoryType)),
        )
          .find(`[data-tag-index=0] > svg`)
          .click();
      });

      it('Using cross on category container', () => {
        cy.get(buildDataCyWrapper(buildPublishChip(category.name)))
          .find(buildDataTestIdWrapper(MUI_CHIP_REMOVE_BTN))
          .click();
      });
    });

    it('Add a category', () => {
      openCategoriesModal();
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
