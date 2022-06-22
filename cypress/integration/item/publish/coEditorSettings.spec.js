import {
  buildCoEditorSettingsRadioGroup,
  buildCustomizedTagsSelector,
  buildPublishButtonId,
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
import { EDIT_TAG_REQUEST_TIMEOUT } from '../../../support/constants';
import { DISPLAY_CO_EDITORS_OPTIONS } from '../../../../src/config/constants';

const openPublishItemTab = (id) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item) => {
  cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

describe('Co-editor Setting', () => {
  it('Display choices and selected value', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);
    Object.values(DISPLAY_CO_EDITORS_OPTIONS).forEach((option) => {
      const displayTags = cy.get(`#${buildCoEditorSettingsRadioGroup(option.value)}`);
      displayTags.should('be.visible');
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
    cy.wait('@editItem', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.settings.tags).contains(NEW_CUSTOMIZED_TAG);
    });
  });
});

describe('Co-editor setting permissions', () => {
  it('User signed out cannot edit co-editor setting', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: SIGNED_OUT_MEMBER,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
    const tagsEdit = cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`);
    tagsEdit.should('not.exist');
  });

  it('Read-only user cannot edit co-editor setting', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
    const tagsEdit = cy.get(`#${ITEM_TAGS_EDIT_INPUT_ID}`);
    tagsEdit.should('not.exist');
  });
});
