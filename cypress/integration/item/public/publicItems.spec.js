import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_SETTINGS_BUTTON_CLASS,
  PUBLIC_SETTING_SWITCH_ID,
} from '../../../../src/config/selectors';
import { SAMPLE_PUBLIC_ITEMS } from '../../../fixtures/items';
import { ITEM_PUBLIC_TAG } from '../../../fixtures/itemTags';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { expectFolderViewScreenLayout } from '../view/utils';

const checkPublicLoginSetting = ({ isEnabled, disabled = false }) => {
  const checkedValue = isEnabled ? 'be.checked' : 'not.be.checked';
  cy.get(`#${PUBLIC_SETTING_SWITCH_ID}`).should(checkedValue);
  if (disabled) {
    cy.get(`#${PUBLIC_SETTING_SWITCH_ID}`).should('be.disabled');
  }
};

const editPublicSetting = (isEnabled) => {
  if (isEnabled) {
    cy.get(`#${PUBLIC_SETTING_SWITCH_ID}`).check();
  } else {
    cy.get(`#${PUBLIC_SETTING_SWITCH_ID}`).uncheck();
  }
  cy.wait('@postItemTag').then(({ response: { body } }) => {
    expect(body?.tagId).to.equal(ITEM_PUBLIC_TAG.id);
  });
};

describe('Public Items', () => {
  describe('Setting', () => {
    it('Successfully enable Public Setting', () => {
      cy.setUpApi(SAMPLE_PUBLIC_ITEMS);
      const item = SAMPLE_PUBLIC_ITEMS.items[1];
      cy.visit(buildItemPath(item.id));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      // set public a private folder
      checkPublicLoginSetting({ isEnabled: false });
      editPublicSetting(true);
    });
  });

  describe('Enabled', () => {
    it('Signed out user can access a public item', () => {
      const currentMember = SIGNED_OUT_MEMBER;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[4];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.wait('@getPublicChildren');
      expectFolderViewScreenLayout({ item, currentMember });
    });

    it('User without a membership can access a public item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[4];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.wait('@getPublicChildren');
      expectFolderViewScreenLayout({ item, currentMember });
    });

    it('User without a membership can access a child of a public item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[2];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.wait('@getPublicChildren');
      expectFolderViewScreenLayout({ item, currentMember });
    });
  });

  describe('Disabled', () => {
    it('Signed out user cannot access a private item', () => {
      const currentMember = SIGNED_OUT_MEMBER;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[1];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });

    it('User without a membership cannot access a private item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[1];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });

    it('User without a membership cannot access a child of a private item', () => {
      const currentMember = MEMBERS.BOB;
      cy.setUpApi({
        ...SAMPLE_PUBLIC_ITEMS,
        currentMember,
      });
      const item = SAMPLE_PUBLIC_ITEMS.items[6];
      cy.visit(buildItemPath(item.id));
      cy.wait('@getPublicItem');
      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });
  });
});
