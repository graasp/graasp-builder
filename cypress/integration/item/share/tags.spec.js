import {
  buildCustomizedTagsSelector,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import { ITEM_WITH_CATEGORIES } from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

describe('Customized Tags', () => {
  it('Display tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    item.settings.tags.forEach((tag, index) => {
      const displayTags = cy.get(`#${buildCustomizedTagsSelector(index)}`);
      displayTags.contains(tag);
    });
  });
});
