import {
  ItemLoginSchemaType,
  PackedFolderItemFactory,
  PackedItem,
  PermissionLevel,
} from '@graasp/sdk';

import { v4 } from 'uuid';

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
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { ITEM_LOGIN_PAUSE } from '../../../support/constants';

const addItemLoginSchema = (
  item: PackedItem,
  itemLoginSchemaType: ItemLoginSchemaType,
) => ({
  ...item,
  itemLoginSchema: {
    item,
    type: itemLoginSchemaType,
    id: v4(),
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
  },
});

const changeSignInMode = (mode: string) => {
  cy.get(`#${ITEM_LOGIN_SIGN_IN_MODE_ID}`).click();
  cy.get(`li[data-value="${mode}"]`).click();
};

const checkItemLoginScreenLayout = (
  itemLoginSchema:
    | ItemLoginSchemaType
    | `${ItemLoginSchemaType}` = SETTINGS_ITEM_LOGIN_DEFAULT,
) => {
  cy.get(`#${ITEM_LOGIN_SIGN_IN_USERNAME_ID}`).should('exist');
  if (itemLoginSchema === ItemLoginSchemaType.UsernameAndPassword) {
    cy.get(`#${ITEM_LOGIN_SIGN_IN_PASSWORD_ID}`).should('exist');
  }
  cy.get(`#${ITEM_LOGIN_SIGN_IN_BUTTON_ID}`).should('exist');
};

const fillItemLoginScreenLayout = ({
  username,
  password,
  memberId,
}: {
  username?: string;
  password?: string;
  memberId?: string;
}) => {
  if (!memberId) {
    changeSignInMode(SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.PSEUDONYM);
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

const checkItemLoginSetting = ({
  isEnabled,
  mode,
  disabled = false,
}: {
  isEnabled: boolean;
  mode: string;
  disabled?: boolean;
}) => {
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

const editItemLoginSetting = (mode: string) => {
  cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}`).click();
  cy.get(`li[data-value="${mode}"]`).click();
  cy.wait('@putItemLoginSchema').then(({ request: { body } }) => {
    expect(body?.type).to.equal(ItemLoginSchemaType.UsernameAndPassword);
  });
};

describe('Item Login', () => {
  it('Item Login not allowed', () => {
    const item = PackedFolderItemFactory({}, { permission: null });
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));
    cy.wait(ITEM_LOGIN_PAUSE);
    cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
  });

  describe('User is signed out', () => {
    describe('Display Item Login Screen', () => {
      it('username or member id', () => {
        const item = addItemLoginSchema(
          PackedFolderItemFactory({}, { permission: null }),
          ItemLoginSchemaType.Username,
        );
        cy.setUpApi({ items: [item], currentMember: SIGNED_OUT_MEMBER });

        cy.visit(buildItemPath(item.id));
        checkItemLoginScreenLayout(item.itemLoginSchema.type);
        fillItemLoginScreenLayout({
          username: 'username',
        });
        cy.wait('@postItemLogin');

        // use memberid
        fillItemLoginScreenLayout({
          memberId: v4(),
        });
        cy.wait('@postItemLogin');

        // use username to check no member id is incorrectly sent
        fillItemLoginScreenLayout({
          username: 'username',
        });
        cy.wait('@postItemLogin');
      });
      it('username or member id and password', () => {
        const item = addItemLoginSchema(
          PackedFolderItemFactory({}, { permission: null }),
          ItemLoginSchemaType.UsernameAndPassword,
        );
        cy.setUpApi({ items: [item], currentMember: SIGNED_OUT_MEMBER });

        cy.visit(buildItemPath(item.id));
        checkItemLoginScreenLayout(item.itemLoginSchema.type);
        fillItemLoginScreenLayout({
          username: 'username',
          password: 'password',
        });
        cy.wait('@postItemLogin');

        // use memberid
        fillItemLoginScreenLayout({
          memberId: v4(),
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
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}, { permission: null }),
        ItemLoginSchemaType.UsernameAndPassword,
      );
      cy.setUpApi({ items: [item], currentMember: MEMBERS.BOB });
      cy.visit(buildItemPath(item.id));

      // avoid to detect intermediate screens because of loading
      // to remove when requests loading time is properly managed
      cy.wait(ITEM_LOGIN_PAUSE);

      cy.get(`#${ITEM_LOGIN_SCREEN_FORBIDDEN_ID}`).should('exist');
    });
  });

  describe('Display Item Login Setting', () => {
    it('edit item login setting', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory(),
        ItemLoginSchemaType.Username,
      );
      const child = {
        ...PackedFolderItemFactory({ parentItem: item }),
        // inherited schema
        itemLoginSchema: item.itemLoginSchema,
      };
      cy.setUpApi({ items: [item, child] });
      // check item with item login enabled
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();

      checkItemLoginSetting({
        isEnabled: true,
        mode: ItemLoginSchemaType.Username,
      });
      editItemLoginSetting(ItemLoginSchemaType.UsernameAndPassword);

      // disabled at child level
      cy.visit(buildItemPath(child.id));
      cy.get(`#${buildShareButtonId(child.id)}`).click();
      checkItemLoginSetting({
        isEnabled: true,
        mode: ItemLoginSchemaType.UsernameAndPassword,
        disabled: true,
      });
    });

    it('read permission', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}, { permission: PermissionLevel.Read }),
        ItemLoginSchemaType.UsernameAndPassword,
      );
      cy.setUpApi({
        items: [item],
        currentMember: MEMBERS.BOB,
      });
      cy.visit(buildItemPath(item.id));
      cy.wait(ITEM_LOGIN_PAUSE);
    });
  });

  describe('Error handling', () => {
    it('error while signing in', () => {
      const item = addItemLoginSchema(
        PackedFolderItemFactory({}, { permission: null }),
        ItemLoginSchemaType.UsernameAndPassword,
      );
      cy.setUpApi({
        items: [item],
        postItemLoginError: true,
        currentMember: SIGNED_OUT_MEMBER,
      });

      // go to children item
      cy.visit(buildItemPath(item.id));

      fillItemLoginScreenLayout({
        username: 'username',
        password: 'password',
      });

      cy.wait(ITEM_LOGIN_PAUSE);

      cy.get(`#${ITEM_LOGIN_SIGN_IN_USERNAME_ID}`).should('exist');
    });
  });
});
