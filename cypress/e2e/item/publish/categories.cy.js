import { CATEGORY_TYPE_TITLES } from '../../../../src/config/constants';
import { buildItemPath } from '../../../../src/config/paths';
import {
  LIBRARY_SETTINGS_CATEGORIES_ID,
  buildCategorySelectionId,
  buildCategorySelectionOptionId,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CATEGORIES,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { PUBLISH_TAB_LOADING_TIME } from '../../../support/constants';

const openPublishItemTab = (id) => {
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
      cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
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
      cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
      cy.visit(buildItemPath(item.id));
      openPublishItemTab(item.id);
    });

    it('Display item category', () => {
      // check for displaying value
      const {
        categories: [{ categoryId }],
      } = item;
      const { name } = SAMPLE_CATEGORIES.find(({ id }) => id === categoryId);
      const categoryContent = cy.get(`#${LIBRARY_SETTINGS_CATEGORIES_ID}`);
      categoryContent.contains(name);
    });

    it('Delete a category', () => {
      const {
        categories: [itemCategory],
      } = item;
      const { categoryId, id } = itemCategory;
      const categoryType = SAMPLE_CATEGORIES.find(
        ({ id: cId }) => cId === categoryId,
      ).type;
      toggleOption(categoryId, categoryType);
      cy.wait('@deleteItemCategory').then((data) => {
        const {
          request: { url },
        } = data;
        expect(url.split('/')).contains(id);
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
        tags: DEFAULT_TAGS,
      });
      cy.visit(buildItemPath(item.id));
      openPublishItemTab(item.id);
      const levelValue = cy.get(
        `#${buildCategorySelectionId(CATEGORY_TYPE_TITLES.LEVEL)}`,
      );
      levelValue.should('not.exist');
    });

    it('Read-only user cannot edit category level', () => {
      const item = PUBLISHED_ITEM;
      cy.setUpApi({
        items: [item],
        currentMember: MEMBERS.BOB,
        tags: DEFAULT_TAGS,
      });
      cy.visit(buildItemPath(item.id));
      openPublishItemTab(item.id);
      const levelValue = cy.get(
        `#${buildCategorySelectionId(CATEGORY_TYPE_TITLES.LEVEL)}`,
      );
      levelValue.should('not.exist');
    });
  });
});
