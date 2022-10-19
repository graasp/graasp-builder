import { v4 as uuidv4 } from 'uuid';

import {
  SETTINGS,
  SETTINGS_ITEM_LOGIN_DEFAULT,
} from '../../../../src/config/constants';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID,
  ITEM_LOGIN_SIGN_IN_MODE_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import { getItemLoginExtra } from '../../../../src/utils/itemExtra';
import { ITEM_LOGIN_ITEMS } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { ITEM_LOGIN_PAUSE } from '../../../support/constants';

const changeSignInMode = (mode) => {
  cy.get(`#${ITEM_LOGIN_SIGN_IN_MODE_ID}`).click();
  cy.get(`li[data-value="${mode}"]`).click();
};

const checkItemLoginScreenLayout = (
  itemLoginSchema = SETTINGS_ITEM_LOGIN_DEFAULT,
) => {
  cy.get(`#${ITEM_LOGIN_SIGN_IN_USERNAME_ID}`).should('exist');
  if (itemLoginSchema === SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD) {
    cy.get(`#${ITEM_LOGIN_SIGN_IN_PASSWORD_ID}`).should('exist');
  }
  cy.get(`#${ITEM_LOGIN_SIGN_IN_BUTTON_ID}`).should('exist');
};

const fillItemLoginScreenLayout = ({ username, password, memberId }) => {
  if (!memberId) {
    changeSignInMode(SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.PSEUDONYME);
    cy.get(`#${ITEM_LOGIN_SIGN_IN_USERNAME_ID}`).clear().type(username);
  } else {
    changeSignInMode(SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.MEMBER_ID);
    cy.get(`#${ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID}`).clear().type(memberId);
  }

  if (password) {
    cy.get(`#${ITEM_LOGIN_SIGN_IN_PASSWORD_ID}`).clear().type(password);
  }
  cy.get(`#${ITEM_LOGIN_SIGN_IN_BUTTON_ID}`).click();
};

const checkItemLoginSetting = ({ isEnabled, mode, disabled = false }) => {
  if (isEnabled && !disabled) {
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID} + input`).should(
      'have.value',
      mode,
    );
  }
  if (disabled) {
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}`).then((el) => {
      // test classnames are 'disabled'
      expect(el.parent().html()).to.contain('disabled');
    });
  }
};

const editItemLoginSetting = (mode) => {
  cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}`).click();
  cy.get(`li[data-value="${mode}"]`).click();
  cy.wait('@putItemLogin').then(({ request: { body } }) => {
    expect(body?.loginSchema).to.equal(
      SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD,
    );
  });
};

describe('Item Login', () => {
  it('Item Login not allowed', () => {
    cy.setUpApi({
      ...ITEM_LOGIN_ITEMS,
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(ITEM_LOGIN_ITEMS.items[4].id));
    cy.wait(ITEM_LOGIN_PAUSE);
    cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
  });

  describe('User is signed out', () => {
    beforeEach(() => {
      cy.setUpApi({ ...ITEM_LOGIN_ITEMS, currentMember: SIGNED_OUT_MEMBER });
    });

    describe('Display Item Login Screen', () => {
      it('username or member id', () => {
        cy.visit(buildItemPath(ITEM_LOGIN_ITEMS.items[0].id));
        checkItemLoginScreenLayout(
          getItemLoginExtra(ITEM_LOGIN_ITEMS.items[0].extra),
        );
        fillItemLoginScreenLayout({
          username: 'username',
        });
        cy.wait('@postItemLogin');

        // use memberid
        fillItemLoginScreenLayout({
          memberId: uuidv4(),
        });
        cy.wait('@postItemLogin');

        // use username to check no member id is incorrectly sent
        fillItemLoginScreenLayout({
          username: 'username',
        });
        cy.wait('@postItemLogin');
      });
      it('username or member id and password', () => {
        cy.visit(buildItemPath(ITEM_LOGIN_ITEMS.items[3].id));
        checkItemLoginScreenLayout(
          getItemLoginExtra(ITEM_LOGIN_ITEMS.items[3].extra),
        );
        fillItemLoginScreenLayout({
          username: 'username',
          password: 'password',
        });
        cy.wait('@postItemLogin');

        // use memberid
        fillItemLoginScreenLayout({
          memberId: uuidv4(),
          password: 'password',
        });
        cy.wait('@postItemLogin');

        // use username to check no member id is incorrectly sent
        fillItemLoginScreenLayout({
          username: 'username',
          password: 'password',
        });
        cy.wait('@postItemLogin');
      });
    });
  });

  describe('User is signed in as normal user', () => {
    it('Should not be able to access the item', () => {
      cy.setUpApi({
        ...ITEM_LOGIN_ITEMS,
        currentMember: MEMBERS.BOB,
      });
      cy.visit(buildItemPath(ITEM_LOGIN_ITEMS.items[4].id));

      // avoid to detect intermediate screens because of loading
      // to remove when requests loading time is properly managed
      cy.wait(ITEM_LOGIN_PAUSE);

      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });
  });

  describe('Display Item Login Setting', () => {
    it('edit item login setting', () => {
      cy.setUpApi(ITEM_LOGIN_ITEMS);
      const item = ITEM_LOGIN_ITEMS.items[0];
      // check item with item login enabled
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      checkItemLoginSetting({
        isEnabled: true,
        mode: SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
      });
      editItemLoginSetting(SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD);

      // disabled at child level
      const item2 = ITEM_LOGIN_ITEMS.items[5];
      cy.visit(buildItemPath(item2.id));
      cy.get(`#${buildShareButtonId(item2.id)}`).click();
      checkItemLoginSetting({
        isEnabled: true,
        mode: SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD,
        disabled: true,
      });
    });

    it('read permission', () => {
      cy.setUpApi({
        ...ITEM_LOGIN_ITEMS,
        currentMember: MEMBERS.BOB,
      });
      cy.visit(buildItemPath(ITEM_LOGIN_ITEMS.items[3].id));
      cy.wait(ITEM_LOGIN_PAUSE);
    });
  });

  describe('Error handling', () => {
    it('error while signing in', () => {
      cy.setUpApi({
        ...ITEM_LOGIN_ITEMS,
        postItemLoginError: true,
        currentMember: SIGNED_OUT_MEMBER,
      });
      const { id } = ITEM_LOGIN_ITEMS.items[4];

      // go to children item
      cy.visit(buildItemPath(id));

      fillItemLoginScreenLayout({
        username: 'username',
        password: 'password',
      });

      cy.wait(ITEM_LOGIN_PAUSE);

      cy.get(`#${ITEM_LOGIN_SIGN_IN_USERNAME_ID}`).should('exist');
    });
  });
});
