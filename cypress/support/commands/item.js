import {
  SHARE_ITEM_MODAL_PERMISSION_SELECT_ID,
  SHARE_ITEM_MODAL_SHARE_BUTTON_ID,
  buildPermissionOptionId,
  SHARE_ITEM_MODAL_EMAIL_INPUT_ID,
  buildTreeItemClass,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_TREE_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DESCRIPTION_INPUT_ID,
  ITEM_FORM_IMAGE_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_FORM_LINK_INPUT_ID,
} from '../../../src/config/selectors';

Cypress.Commands.add('fillShareModal', ({ member, permission }) => {
  // select permission
  cy.get(`#${SHARE_ITEM_MODAL_PERMISSION_SELECT_ID}`).click();
  cy.get(`#${buildPermissionOptionId(permission)}`).click();

  // input mail
  cy.get(`#${SHARE_ITEM_MODAL_EMAIL_INPUT_ID}`).type(member.email);

  cy.get(`#${SHARE_ITEM_MODAL_SHARE_BUTTON_ID}`).click();
});

Cypress.Commands.add('fillTreeModal', (toItemId) => {
  cy.get(
    `#${TREE_MODAL_TREE_ID} .${buildTreeItemClass(
      toItemId,
    )} .MuiTreeItem-label`,
  )
    .first()
    .click();

  cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
});

Cypress.Commands.add(
  'fillBaseItemModal',
  ({ name = '', description = '' }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).clear().type(name);

    cy.get(`#${ITEM_FORM_DESCRIPTION_INPUT_ID}`).clear().type(description);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillSpaceModal',
  ({ name = '', extra = {}, description = '' }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).clear().type(name);

    cy.get(`#${ITEM_FORM_DESCRIPTION_INPUT_ID}`).clear().type(description);

    cy.get(`#${ITEM_FORM_IMAGE_INPUT_ID}`).clear().type(extra.image);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillLinkModal',
  ({ name = '', extra = {}, description = '' }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).clear().type(name);

    cy.get(`#${ITEM_FORM_DESCRIPTION_INPUT_ID}`).clear().type(description);

    cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`)
      .clear()
      .type(extra?.embeddedLinkItem?.url);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);
