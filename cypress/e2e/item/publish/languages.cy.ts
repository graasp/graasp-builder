import { Category, CategoryType } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  LANGUAGES_ADD_BUTTON_HEADER,
  LIBRARY_SETTINGS_LANGUAGES_ID,
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
  ITEM_WITH_LANGUAGE,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const LANGUAGES_DATA_CY = buildDataCyWrapper(
  buildPublishChipContainer(LIBRARY_SETTINGS_LANGUAGES_ID),
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

const openLanguagesModal = () => {
  cy.get(buildDataCyWrapper(LANGUAGES_ADD_BUTTON_HEADER)).click();
};

describe('Item without language', () => {
  it('Display item without language', () => {
    const item = { ...ITEM_WITH_LANGUAGE, categories: [] as Category[] };
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);

    // check for not displaying if no categories
    cy.get(LANGUAGES_DATA_CY).should('not.exist');
  });
});

describe('Item with language', () => {
  const item = ITEM_WITH_LANGUAGE;

  beforeEach(() => {
    cy.setUpApi({ items: [ITEM_WITH_LANGUAGE] });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
  });

  it('Display item language', () => {
    // check for displaying value
    const {
      categories: [{ category }],
    } = item;
    const { name } = SAMPLE_CATEGORIES.find(({ id }) => id === category.id);
    cy.get(LANGUAGES_DATA_CY).contains(name);
  });

  describe('Delete a language', () => {
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
      openLanguagesModal();
      toggleOption(category.id, categoryType);
    });

    it('Using cross on language tag in modal', () => {
      openLanguagesModal();

      cy.get(
        buildDataCyWrapper(buildCategoryDropdownParentSelector(categoryType)),
      )
        .find(`[data-tag-index=0] > svg`)
        .click();
    });

    it('Using cross on language container', () => {
      cy.get(buildDataCyWrapper(buildPublishChip(category.name)))
        .find(buildDataTestIdWrapper(MUI_CHIP_REMOVE_BTN))
        .click();
    });
  });

  it('Add a language', () => {
    openLanguagesModal();
    const { type, id } = SAMPLE_CATEGORIES[3];
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
describe('Languages permissions', () => {
  it('User signed out cannot edit language level', () => {
    const item = PUBLISHED_ITEM;

    cy.setUpApi({
      items: [item],
      currentMember: SIGNED_OUT_MEMBER,
    });
    cy.visit(buildItemPath(item.id));

    // signed out user should not be able to see the publish button
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });

  it('Read-only user cannot edit language level', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));

    // signed out user should not be able to see the publish button
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });
});
