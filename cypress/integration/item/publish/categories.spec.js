import {
  buildCategoriesSelectionValueSelector,
  buildCategoryMenuOptions,
  buildCategorySelectionId,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_WITH_CATEGORIES,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { CATEGORY_TYPE_TITLES } from '../../../../src/config/constants';

const openPublishItemTab = (id) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const findCategoryNameById = (id) =>
  SAMPLE_CATEGORIES.find((entry) => entry.id === id)?.name;

export const deleteOption = (index) => {
  cy.get(`#${buildCategorySelectionId(CATEGORY_TYPE_TITLES.LEVEL)}`).click();
  cy.get(
    buildCategoryMenuOptions(
      buildCategorySelectionId(CATEGORY_TYPE_TITLES.LEVEL),
      index,
    ),
  ).click();
};

export const addOption = (index) => {
  cy.get(
    `#${buildCategorySelectionId(CATEGORY_TYPE_TITLES.DISCIPLINE)}`,
  ).click();
  cy.get(
    buildCategoryMenuOptions(
      buildCategorySelectionId(CATEGORY_TYPE_TITLES.DISCIPLINE),
      index,
    ),
  ).click();
};

describe('Categories', () => {
  const item = ITEM_WITH_CATEGORIES;
  beforeEach(() => {
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
  });

  it('Display Item Categories', () => {
    // check for displaying value
    const levelValue = cy.get(
      buildCategoriesSelectionValueSelector(CATEGORY_TYPE_TITLES.LEVEL),
    );
    levelValue
      .first()
      .contains(findCategoryNameById(item.categories[0].categoryId));
  });

  it('Display item without category', () => {
    // check for not displaying if no categories
    const disciplineValue = cy.get(
      `#${buildCategorySelectionId(CATEGORY_TYPE_TITLES.DISCIPLINE)}`,
    );
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
