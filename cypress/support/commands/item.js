import {
  FOLDER_FORM_DESCRIPTION_ID,
  ITEM_FORM_APP_URL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DOCUMENT_TEXT_SELECTOR,
  ITEM_FORM_LINK_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_MY_ITEMS_ID,
  buildItemFormAppOptionId,
  buildPermissionOptionId,
  buildTreeItemId,
} from '../../../src/config/selectors';
import { getParentsIdsFromPath } from '../../../src/utils/item';
import {
  getAppExtra,
  getDocumentExtra,
  getEmbeddedLinkExtra,
} from '../../../src/utils/itemExtra';
import { NEW_APP_NAME } from '../../fixtures/apps/apps';
import { TREE_VIEW_PAUSE } from '../constants';

Cypress.Commands.add(
  'fillShareForm',
  ({ member, permission, submit = true, selector = '' }) => {
    // select permission
    cy.get(`${selector} .${ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}`).click();
    cy.get(`#${buildPermissionOptionId(permission)}`).click();

    // input mail
    cy.get(`#${SHARE_ITEM_EMAIL_INPUT_ID}`).type(member.email);

    if (submit) {
      // wait for email to be validated and enable the button
      cy.wait(1000);
      cy.get(`#${SHARE_ITEM_SHARE_BUTTON_ID}`).click('left');
    }
  },
);

Cypress.Commands.add(
  'fillTreeModal',
  (toItemPath, treeRootId = TREE_MODAL_MY_ITEMS_ID) => {
    const ids = getParentsIdsFromPath(toItemPath);

    cy.wait(TREE_VIEW_PAUSE);

    [treeRootId, ...ids].forEach((value, idx, array) => {
      cy.get(`#${treeRootId}`).then(($tree) => {
        // click on the element
        if (idx === array.length - 1) {
          cy.wrap($tree)
            .get(
              `#${buildTreeItemId(value, treeRootId)} .MuiTreeItem-label input`,
            )
            .first()
            .click();
        }
        // if can't find children click on parent (current value)
        if (
          idx !== array.length - 1 &&
          !$tree.find(
            `#${buildTreeItemId(
              array[idx + 1],
              treeRootId,
            )} .MuiTreeItem-label`,
          ).length
        ) {
          cy.wrap($tree)
            .get(`#${buildTreeItemId(value, treeRootId)} .MuiTreeItem-label`)
            .first()
            .click();
        }
      });
    });

    cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
  },
);

Cypress.Commands.add(
  'fillBaseItemModal',
  ({ name = '' }, { confirm = true } = {}) => {
    // first select all the text and then remove it to have a clear field, then type new text
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).type(`{selectall}{backspace}${name}`);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillFolderModal',
  ({ name = '', description = '' }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });
    // first select all the text and then remove it to have a clear field, then type new description
    cy.get(`#${FOLDER_FORM_DESCRIPTION_ID}`).type(
      `{selectall}{backspace}${description}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillLinkModal',
  ({ extra = {} }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`).type(
      // first select all the text and then remove it to have a clear field, then type new text
      `{selectall}{backspace}${getEmbeddedLinkExtra(extra)?.url}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillDocumentModal',
  ({ name = '', extra = {} }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    cy.get(ITEM_FORM_DOCUMENT_TEXT_SELECTOR).type(
      // first select all the text and then remove it to have a clear field, then type new text
      `{selectall}{backspace}${getDocumentExtra(extra)?.content}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillAppModal',
  ({ name = '', extra = {} }, { confirm = true, type = false } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    cy.get(`#${ITEM_FORM_APP_URL_ID}`).click();
    if (type) {
      cy.get(`#${ITEM_FORM_APP_URL_ID}`).type(getAppExtra(extra)?.url);
    } else {
      cy.get(`#${buildItemFormAppOptionId(getAppExtra(extra)?.name)}`).click();
      // check name get added automatically
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).should(
        'have.value',
        getAppExtra(extra)?.name,
      );
      // edit the app name
      cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`)
        .type(`{selectall}{backspace}${NEW_APP_NAME}`)
        .should('have.value', NEW_APP_NAME);
    }

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

// This command was based on a solution found on github
// https://github.com/cypress-io/cypress/issues/3942#issuecomment-485648100
Cypress.Commands.add('dragAndDrop', (subject, x, y) => {
  cy.get(subject)
    .first()
    // eslint-disable-next-line no-shadow
    .then((subject) => {
      const coordsDrag = subject[0].getBoundingClientRect();
      cy.wrap(subject)
        .trigger('mousedown', {
          button: 0,
          clientX: coordsDrag.x,
          clientY: coordsDrag.y,
          force: true,
        })
        .trigger('mousemove', {
          button: 0,
          clientX: coordsDrag.x + 10,
          clientY: coordsDrag.y,
          force: true,
        });
      cy.get('body')
        .trigger('mousemove', {
          button: 0,
          clientX: coordsDrag.x + x,
          clientY: coordsDrag.y + y,
          force: true,
        })
        .trigger('mouseup');
    });
});
