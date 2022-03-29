import {
  buildCustomizedTagsSelector,
  buildShareButtonId,
  ITEM_TAGS_EDIT_INPUT_ID,
  ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_WITH_CATEGORIES,
  NEW_CUSTOMIZED_TAG,
} from '../../../fixtures/categories';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

const visitItemPage = (item) => {
  cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
  cy.visit(buildItemPath(item.id));
  openShareItemTab(item.id);
};

describe('Customized Tags', () => {
  it('Display tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);
    item.settings.tags.forEach((tag, index) => {
      const displayTags = cy.get(`#${buildCustomizedTagsSelector(index)}`);
      displayTags.contains(tag);
    });
  });

  it('Display item without tags', () => {
    // check for not displaying if no tags
    visitItemPage(PUBLISHED_ITEM);
    cy.get(`#${buildCustomizedTagsSelector(0)}`).should('not.exist');
    cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`).should('have.text', '');
  });

  it('Edit tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);
    cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`)
      .clear()
      .type(NEW_CUSTOMIZED_TAG)
      .should('have.text', NEW_CUSTOMIZED_TAG);
    cy.get(`#${ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID}`).click();
    cy.wait('@editItem').then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.settings.tags).contains(NEW_CUSTOMIZED_TAG);
    });
  });
});

describe('Tags permissions', () => {
  it('User signed out cannot edit tags', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: SIGNED_OUT_MEMBER,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    const tagsEdit = cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`);
    tagsEdit.should('be.disabled');
  });

  it('Read-only user cannot edit tags', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    const tagsEdit = cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`);
    tagsEdit.should('be.disabled');
  });
});
