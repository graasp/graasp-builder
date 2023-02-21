import {
  DISPLAY_CO_EDITORS_OPTIONS,
  SETTINGS,
} from '../../../../src/config/constants';
import { buildItemPath } from '../../../../src/config/paths';
import {
  CO_EDITOR_SETTINGS_RADIO_GROUP_ID,
  ITEM_HEADER_ID,
  ITEM_VALIDATION_BUTTON_ID,
  ITEM_VALIDATION_REFRESH_BUTTON_ID,
  buildCoEditorSettingsRadioButtonId,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { ITEM_WITH_CATEGORIES } from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { EDIT_TAG_REQUEST_TIMEOUT } from '../../../support/constants';
import { changeVisibility } from '../share/shareItem.cy';

const openPublishItemTab = (id) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item) => {
  cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

describe('Co-editor Setting', () => {
  it('Display choices', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);

    Object.values(DISPLAY_CO_EDITORS_OPTIONS).forEach((option) => {
      const displayTags = cy.get(
        `#${buildCoEditorSettingsRadioButtonId(option.value)}`,
      );
      displayTags.should('be.visible');
    });
  });

  it('Change choice', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);

    const newOptionValue = DISPLAY_CO_EDITORS_OPTIONS.NO.value;

    changeVisibility(SETTINGS.ITEM_PUBLIC.name);
    cy.get(`#${ITEM_VALIDATION_BUTTON_ID}`).click();
    cy.get(`#${ITEM_VALIDATION_REFRESH_BUTTON_ID}`).click();
    cy.wait('@getItemValidationAndReview').then(() => {
      cy.get(`#${buildCoEditorSettingsRadioButtonId(newOptionValue)}`).click();
    });

    cy.wait('@editItem', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.settings.displayCoEditors).equals(newOptionValue);
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

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    // signed-out user should not see publish button on public item
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
    cy.get(`#${CO_EDITOR_SETTINGS_RADIO_GROUP_ID}`).should('not.exist');
  });

  it('Read-only user cannot edit co-editor setting', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
      tags: DEFAULT_TAGS,
    });
    cy.visit(buildItemPath(item.id));

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    openPublishItemTab(item.id);
    cy.get(`#${CO_EDITOR_SETTINGS_RADIO_GROUP_ID}`).should('not.exist');
  });
});
