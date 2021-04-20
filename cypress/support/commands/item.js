import { ROOT_ID } from '../../../src/config/constants';
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
import { getEmbeddedLinkExtra } from '../../../src/utils/itemExtra';
import { getParentsIdsFromPath } from '../../../src/utils/item';

Cypress.Commands.add('fillShareModal', ({ member, permission }) => {
  // select permission
  cy.get(`#${SHARE_ITEM_MODAL_PERMISSION_SELECT_ID}`).click();
  cy.get(`#${buildPermissionOptionId(permission)}`).click();

  // input mail
  cy.get(`#${SHARE_ITEM_MODAL_EMAIL_INPUT_ID}`).type(member.email);

  cy.get(`#${SHARE_ITEM_MODAL_SHARE_BUTTON_ID}`).click();
});

Cypress.Commands.add('fillTreeModal', (toItemPath) => {
  const ids = getParentsIdsFromPath(toItemPath);

  [ROOT_ID, ...ids].forEach((value, idx, array) => {
    // do the check twice to be sure the tree item is opened
    for (let i = 0; i < 2; i += 1) {
      cy.get(`#${TREE_MODAL_TREE_ID}`).then(($tree) => {
        // if can't find children click on parent (current value)
        // or is item to select
        if (
          idx === array.length - 1 ||
          !$tree.find(
            `.${buildTreeItemClass(array[idx + 1])} .MuiTreeItem-label`,
          ).length
        ) {
          cy.wrap($tree)
            .get(`.${buildTreeItemClass(value)} .MuiTreeItem-label`)
            .first()
            .click();
        }
      });
    }
  });

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
  ({ extra = {} }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`)
      .clear()
      .type(getEmbeddedLinkExtra(extra)?.url);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);
