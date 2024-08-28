import {
  ItemLoginSchemaType,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { buildItemPath } from '../../../../../src/config/paths';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  buildShareButtonId,
} from '../../../../../src/config/selectors';
import { MEMBERS } from '../../../../fixtures/members';
import { ITEM_LOGIN_PAUSE } from '../../../../support/constants';
import { addItemLoginSchema } from './utils';

const checkItemLoginSetting = ({
  mode,
  disabled = false,
}: {
  mode: string;
  disabled?: boolean;
}) => {
  if (!disabled) {
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID} + input`).should(
      'have.value',
      mode,
    );
  } else {
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
    expect(body?.type).to.equal(mode);
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
        mode: ItemLoginSchemaType.Username,
      });
      editItemLoginSetting(ItemLoginSchemaType.UsernameAndPassword);

      // disabled at child level
      cy.visit(buildItemPath(child.id));
      cy.get(`#${buildShareButtonId(child.id)}`).click();
      checkItemLoginSetting({
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
});
