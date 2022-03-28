import {
  buildCategoryMenuOptions,
  buildShareButtonId,
  CATEGORIES_SELECTION_VALUE_SELECTOR,
  SHARE_ITEM_CATEGORY_DISCIPLINE,
  SHARE_ITEM_CATEGORY_LEVEL,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_WITH_CATEGORIES,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

const findCategoryNameById = (id) =>
  SAMPLE_CATEGORIES.find((entry) => entry.id === id)?.name;

export const deleteOption = (index) => {
  cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`).click();
  cy.get(buildCategoryMenuOptions(SHARE_ITEM_CATEGORY_LEVEL, index)).click();
};

export const addOption = (index) => {
  cy.get(`#${SHARE_ITEM_CATEGORY_DISCIPLINE}`).click();
  cy.get(
    buildCategoryMenuOptions(SHARE_ITEM_CATEGORY_DISCIPLINE, index),
  ).click();
};

describe('Categories', () => {
  const item = ITEM_WITH_CATEGORIES;
  beforeEach(() => {
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    cy.wait(1000);
  });

  it('Display Item Categories', () => {
    // check for displaying value
    const levelValue = cy.get(`${CATEGORIES_SELECTION_VALUE_SELECTOR}`);
    levelValue
      .first()
      .contains(findCategoryNameById(item.categories[0].categoryId));
  });

  it('Display item without category', () => {
    // check for not displaying if no categories
    const disciplineValue = cy.get(`#${SHARE_ITEM_CATEGORY_DISCIPLINE}`);
    disciplineValue.should('be.empty');
  });

  it('Delete a category option', () => {
    // delete selection
    const optionIndex = 0;
    deleteOption(optionIndex);
    cy.wait('@deleteItemCategory').then((data) => {
      const entryId = item.categories[optionIndex].id;
      const {
        request: { url },
      } = data;
      expect(url.split('/')).contains(entryId);
    });
  });

  it('Add a category option', () => {
    const optionIndex = 0;
    addOption(optionIndex);
    cy.wait('@postItemCategory').then((data) => {
      const {
        request: { url },
      } = data;
      expect(url.split('/')).contains(item.id);
    });
  });
});

describe('Categories permissions', () => {
  it('User signed out cannot edit category level', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: SIGNED_OUT_MEMBER,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    cy.wait(1000);
    const levelValue = cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`);
    levelValue.should('be.disabled');
  });

  it('Read-only user cannot edit category level', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    cy.wait(1000);
    const levelValue = cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`);
    levelValue.should('be.disabled');
  });
});
