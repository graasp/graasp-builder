import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_HEADER_ID,
  ITEM_TAGS_EDIT_INPUT_ID,
  ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID,
  buildCustomizedTagsSelector,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CATEGORIES,
  ITEM_WITH_CATEGORIES_CONTEXT,
  NEW_CUSTOMIZED_TAG,
} from '../../../fixtures/categories';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { EDIT_TAG_REQUEST_TIMEOUT } from '../../../support/constants';

const openPublishItemTab = (id) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item) => {
  cy.setUpApi(ITEM_WITH_CATEGORIES_CONTEXT);
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

describe('Customized Tags', () => {
  it('Display item without tags', () => {
    // check for not displaying if no tags
    const item = PUBLISHED_ITEM;
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
    cy.get(`#${buildCustomizedTagsSelector(0)}`).should('not.exist');
    cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`).should('have.text', '');
  });

  it('Display tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);
    expect(item.settings.tags).to.have.lengthOf.above(0);
    item.settings.tags!.forEach((tag, index) => {
      const displayTags = cy.get(`#${buildCustomizedTagsSelector(index)}`);
      displayTags.contains(tag);
    });
  });

  it('Edit tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);
    cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`)
      .clear()
      .type(NEW_CUSTOMIZED_TAG)
      .should('have.text', NEW_CUSTOMIZED_TAG);
    cy.get(`#${ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID}`).click();
    cy.wait('@editItem', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then((data) => {
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
    });
    cy.visit(buildItemPath(item.id));

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    // signed out user can not see the publish menu
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
    cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`).should('not.exist');
  });

  it('Read-only user cannot edit tags', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });
});
