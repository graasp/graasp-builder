import { ItemLoginSchemaType, PackedFolderItemFactory } from '@graasp/sdk';

import { SETTINGS_ITEM_LOGIN_DEFAULT } from '../../../../../src/config/constants';
import { buildItemPath } from '../../../../../src/config/paths';
import {
  ENROLL_BUTTON_SELECTOR,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_SIGN_IN_PASSWORD_ID,
  ITEM_LOGIN_SIGN_IN_USERNAME_ID,
  buildDataCyWrapper,
} from '../../../../../src/config/selectors';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../../fixtures/members';
import { ITEM_LOGIN_PAUSE } from '../../../../support/constants';
import { addItemLoginSchema } from './utils';

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
}: {
  username?: string;
  password?: string;
}) => {
  cy.get(`#${ITEM_LOGIN_SIGN_IN_USERNAME_ID}`).clear().type(username);

  if (password) {
    cy.get(`#${ITEM_LOGIN_SIGN_IN_PASSWORD_ID}`).clear().type(password);
  }
  cy.get(`#${ITEM_LOGIN_SIGN_IN_BUTTON_ID}`).click();
};

describe('User is signed out', () => {
  describe('Display Item Login Screen', () => {
    it('username', () => {
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
    });
    it('username and password', () => {
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

describe('User is signed in as normal user', () => {
  it('Enroll to item automatically', () => {
    const item = addItemLoginSchema(
      PackedFolderItemFactory({}, { permission: null }),
      ItemLoginSchemaType.UsernameAndPassword,
    );
    cy.setUpApi({ items: [item], currentMember: MEMBERS.BOB });
    cy.visit(buildItemPath(item.id));

    // avoid to detect intermediate screens because of loading
    // to remove when requests loading time is properly managed
    cy.wait(ITEM_LOGIN_PAUSE);

    // enroll
    cy.get(buildDataCyWrapper(ENROLL_BUTTON_SELECTOR)).click();
    cy.wait('ENROLL');
  });
});
