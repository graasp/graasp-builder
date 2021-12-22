import {
  buildShareButtonId,
  SHARE_ITEM_CATEGORY_DISCIPLINE,
  SHARE_ITEM_CATEGORY_LEVEL,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  CUSTOMIZED_TAGS,
  ITEM_WITH_CATEGORIES,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const deleteOption = () => {
  cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`).click();
  cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
};

export const addOption = () => {
  cy.get(`#${SHARE_ITEM_CATEGORY_DISCIPLINE}`).click();
  cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
};

describe('Categories', () => {
  it('Item Categories', () => {
    const item = ITEM_WITH_CATEGORIES;
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // check for displaying value
    const levelValue = cy.get(
      'div.MuiChip-root.MuiAutocomplete-tag.MuiChip-deletable > span',
    );
    levelValue.first().contains(SAMPLE_CATEGORIES[0].name);

    // check for not displaying if no categories
    const disciplineValue = cy.get(`#${SHARE_ITEM_CATEGORY_DISCIPLINE}`);
    disciplineValue.should('be.empty');

    const displayTags = cy.get('span.MuiChip-label');
    displayTags.contains(CUSTOMIZED_TAGS[0]);

    // delete selection
    deleteOption();
    cy.wait(['@deleteItemCategory']).then((data) => {
      const entryId = item.categories[0].id;
      const {
        request: { url },
      } = data;
      expect(url.split('/')[4]).equal('item-category');
      expect(url.split('/')[5]).equal(entryId);
    });

    // add selection
    addOption();
    cy.wait(['@postItemCategory']).then((data) => {
      const {
        request: { url },
      } = data;
      expect(url.split('/')[3]).equal('items');
      expect(url.split('/')[4]).equal(item.id);
    });
  });
});
