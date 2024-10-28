import {
  PackedFolderItemFactory,
  PackedLocalFileItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { buildItemPath, buildItemSharePath } from '../../../src/config/paths';
import {
  CREATE_MEMBERSHIP_FORM_ID,
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  SHARE_BUTTON_SELECTOR,
  SHARE_ITEM_CANCEL_BUTTON_CY,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
  buildDataCyWrapper,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { MEMBERS } from '../../fixtures/members';

const shareItem = ({
  id,
  email,
  permission,
  submit,
}: {
  email: string;
  permission: PermissionLevel;
  submit?: boolean;
  id: string;
}) => {
  cy.get(`#${buildShareButtonId(id)}`).click();

  cy.fillShareForm({
    email,
    permission,
    submit,
    selector: `#${CREATE_MEMBERSHIP_FORM_ID}`,
  });
};

const IMAGE_ITEM = PackedLocalFileItemFactory();
const FOLDER = PackedFolderItemFactory();

const ITEMS = [IMAGE_ITEM, FOLDER];

describe('Create Membership', () => {
  it('share item', () => {
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    // share
    const member = MEMBERS.FANNY;
    const permission = PermissionLevel.Read;
    shareItem({ id, email: member.email, permission });

    cy.wait('@postInvitations').then(
      ({
        request: {
          url,
          body: { invitations },
        },
      }) => {
        expect(url).to.contain(id);
        expect(invitations[0].permission).to.equal(permission);
        expect(invitations[0].email).to.equal(member.email);
      },
    );

    // check that the email field is emptied after sharing completes
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).should('be.empty');
  });

  it('open share modal, cancel and sharing reset content', () => {
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = FOLDER;
    cy.visit(buildItemSharePath(id));

    // open modal and cancel
    cy.get(buildDataCyWrapper(SHARE_BUTTON_SELECTOR)).click();
    cy.get(buildDataCyWrapper(SHARE_ITEM_CANCEL_BUTTON_CY)).click();
    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('not.exist');

    // share
    const member = MEMBERS.FANNY;
    const permission = PermissionLevel.Admin;
    cy.fillShareForm({
      email: member.email,
      permission,
      selector: `#${CREATE_MEMBERSHIP_FORM_ID}`,
    });

    // check that fields are reset if reopen modal
    cy.get(buildDataCyWrapper(SHARE_BUTTON_SELECTOR)).click();
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).should('be.empty');
    cy.get(`.${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS} input`).should(
      'have.value',
      PermissionLevel.Read,
    );
  });

  it('share item with new admin by pressing enter', () => {
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    // share
    const member = MEMBERS.FANNY;
    const permission = PermissionLevel.Admin;
    shareItem({
      id,
      email: `${member.email}{Enter}`,
      permission,
      submit: false,
    });

    cy.wait('@postInvitations').then(
      ({
        request: {
          url,
          body: { invitations },
        },
      }) => {
        expect(url).to.contain(id);
        expect(invitations[0].permission).to.equal(permission);
        expect(invitations[0].email).to.equal(member.email);
      },
    );

    // check that the email field is emptied after sharing completes
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).should('be.empty');
  });

  it('cannot add membership item twice', () => {
    const ITEM = PackedFolderItemFactory();
    const account = MEMBERS.ANNA;
    cy.setUpApi({
      items: [
        {
          ...ITEM,
          memberships: [
            {
              item: ITEM,
              permission: PermissionLevel.Read,
              account,
            },
          ],
        },
      ],
      members: Object.values(MEMBERS),
    });

    // go to children item
    const { id } = ITEM;
    cy.visit(buildItemPath(id));

    // fill
    const permission = PermissionLevel.Read;
    shareItem({ id, email: account.email, permission });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });

  it('cannot invite user twice', () => {
    const ITEM = PackedFolderItemFactory();
    const { email } = MEMBERS.CEDRIC;
    cy.setUpApi({
      items: [
        {
          ...ITEM,
          invitations: [{ email }],
        },
      ],
      members: Object.values(MEMBERS),
    });

    const { id } = ITEM;
    cy.visit(buildItemPath(id));

    // fill
    const permission = PermissionLevel.Read;
    shareItem({ id, email, permission });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });

  it('cannot share item with invalid data', () => {
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    // fill
    const permission = PermissionLevel.Read;
    shareItem({ id, email: 'wrong', permission });

    cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).should('be.disabled');
  });
});
