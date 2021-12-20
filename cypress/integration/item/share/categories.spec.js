import {
  buildShareButtonId,
  SHARE_ITEM_CATEGORY_LEVEL,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_WITH_CATEGORIES,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const changeCategory = (value) => {
  cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`).click();
  cy.get(`li[data-value="${value}"]`).click();
};

describe('Categories', () => {
  it('Item Categories', () => {
    const item = ITEM_WITH_CATEGORIES;
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // css selector
    const categorySelect = cy.get('span.MuiChip-label');

    categorySelect.contains(SAMPLE_CATEGORIES[0].name);
  });
});
