import {
  DISPLAY_CO_EDITORS_OPTIONS,
  SETTINGS,
} from '../../../../src/config/constants';
import { buildItemPath } from '../../../../src/config/paths';
import {
  CO_EDITOR_SETTINGS_RADIO_GROUP_ID,
  ITEM_HEADER_ID,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
  buildCoEditorSettingsRadioButtonId,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { ITEM_WITH_CATEGORIES_CONTEXT } from '../../../fixtures/categories';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { EDIT_TAG_REQUEST_TIMEOUT } from '../../../support/constants';

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const changeVisibility = (value: string): void => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`, { timeout: 1000 }).click();
};

const visitItemPage = () => {
  cy.setUpApi(ITEM_WITH_CATEGORIES_CONTEXT);
  const item = ITEM_WITH_CATEGORIES_CONTEXT.items[0];
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

describe('Co-editor Setting', () => {
  it('Display choices', () => {
    visitItemPage();

    Object.values(DISPLAY_CO_EDITORS_OPTIONS).forEach((option) => {
      cy.get(`#${buildCoEditorSettingsRadioButtonId(option.value)}`)
        .scrollIntoView()
        .should('be.visible');
    });
  });

  it('Change choice', () => {
    visitItemPage();
    const item = ITEM_WITH_CATEGORIES_CONTEXT.items[0];

    const newOptionValue = DISPLAY_CO_EDITORS_OPTIONS.NO.value;

    changeVisibility(SETTINGS.ITEM_PUBLIC.name);
    cy.wait('@getLatestValidationGroup').then(() => {
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
    });
    cy.visit(buildItemPath(item.id));

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });
});
