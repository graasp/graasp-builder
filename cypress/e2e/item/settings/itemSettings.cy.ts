import { MaxWidth } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  CLEAR_CHAT_CONFIRM_BUTTON_ID,
  CLEAR_CHAT_DIALOG_ID,
  CLEAR_CHAT_SETTING_ID,
  DOWNLOAD_CHAT_BUTTON_ID,
  FILE_SETTING_MAX_WIDTH_ID,
  ITEM_SETTINGS_BUTTON_CLASS,
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_LINK_SHOW_BUTTON_ID,
  SETTINGS_LINK_SHOW_IFRAME_ID,
  SETTINGS_PINNED_TOGGLE_ID,
  SETTINGS_SAVE_ACTIONS_TOGGLE_ID,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CHATBOX_MESSAGES,
  ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN,
} from '../../../fixtures/chatbox';
import {
  IMAGE_ITEM_DEFAULT,
  IMAGE_ITEM_DEFAULT_WITH_MAX_WIDTH,
} from '../../../fixtures/files';
import { ITEMS_SETTINGS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { verifyDownloadedChat } from '../../../support/utils';

describe('Item Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      ...ITEMS_SETTINGS,
      items: [
        ...ITEMS_SETTINGS.items,
        GRAASP_LINK_ITEM,
        ITEM_WITH_CHATBOX_MESSAGES,
        ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN,
        IMAGE_ITEM_DEFAULT,
        IMAGE_ITEM_DEFAULT_WITH_MAX_WIDTH,
      ],
    });
  });

  describe('Chatbox Settings', () => {
    it('Disabling Chatbox', () => {
      const itemId = ITEMS_SETTINGS.items[1].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).should('be.checked');

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings?.showChatbox).equals(false);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Enabling Chatbox', () => {
      const itemId = ITEMS_SETTINGS.items[2].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).should('not.be.checked');

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings?.showChatbox).equals(true);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Download Chat', () => {
      const itemId = ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN.id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${DOWNLOAD_CHAT_BUTTON_ID}`)
        .should('exist')
        .and('be.visible')
        // download file
        .click();

      // get file name from data-cy-filename attribute and check local csv
      cy.get(`#${DOWNLOAD_CHAT_BUTTON_ID}`)
        .should('have.attr', 'data-cy-filename')
        .then((filename) => {
          verifyDownloadedChat(
            filename.toString(),
            ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN.chat.length,
          );
        });
    });

    it('Clear Chat', () => {
      const itemId = ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN.id;
      // navigate to the item
      cy.visit(buildItemPath(itemId));
      // open the settings of the item
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      // click on the clear chat button
      cy.get(`#${CLEAR_CHAT_SETTING_ID}`)
        .should('exist')
        .and('be.visible')
        .click();

      // check that the dialog is open
      cy.get(`#${CLEAR_CHAT_DIALOG_ID}`);

      // try to download the chat backup
      cy.get(`#${CLEAR_CHAT_DIALOG_ID} #${DOWNLOAD_CHAT_BUTTON_ID}`)
        .should('exist')
        .and('be.visible')
        // download file
        .click();

      // get file name from data-cy-filename attribute and check local csv
      cy.get(`#${CLEAR_CHAT_DIALOG_ID} #${DOWNLOAD_CHAT_BUTTON_ID}`)
        .should('have.attr', 'data-cy-filename')
        .then((filename) => {
          verifyDownloadedChat(
            filename.toString(),
            ITEM_WITH_CHATBOX_MESSAGES.chat.length,
          );
        });

      // check that the buttons are there
      cy.get(`#${CLEAR_CHAT_CONFIRM_BUTTON_ID}`)
        .should('exist')
        .and('be.visible')
        .click();

      cy.wait('@clearItemChat');
    });

    it('Unauthorized to clear Chat', () => {
      const itemId = ITEM_WITH_CHATBOX_MESSAGES.id;
      // navigate to the item
      cy.visit(buildItemPath(itemId));
      // open the settings of the item
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      // check that the clear button is not shown
      cy.get(`#${CLEAR_CHAT_SETTING_ID}`).should('not.exist');

      // check that the download button is not shown
      cy.get(`#${DOWNLOAD_CHAT_BUTTON_ID}`).should('not.exist');
    });
  });

  describe('Pinned Settings', () => {
    it('Unpin Items', () => {
      const itemId = ITEMS_SETTINGS.items[1].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).should('be.checked');

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).equals(false);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Pin Item', () => {
      const itemId = ITEMS_SETTINGS.items[2].id;
      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).should('not.be.checked');

      cy.get(`#${SETTINGS_PINNED_TOGGLE_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.isPinned).equals(true);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });
  });

  describe('Analytics Settings', () => {
    it('Layout', () => {
      const itemId = ITEMS_SETTINGS.items[2].id;
      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_SAVE_ACTIONS_TOGGLE_ID}`)
        .should('exist')
        .should('be.disabled')
        .should('not.be.checked');
    });
  });

  describe('Link Settings', () => {
    it('Does not show link settings for folder item', () => {
      const itemId = ITEMS_SETTINGS.items[0].id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).should('not.exist');
      cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).should('not.exist');
    });

    it('Toggle Iframe', () => {
      const itemId = GRAASP_LINK_ITEM.id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).should('not.be.checked');

      cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.showLinkIframe).equals(true);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Toggle Button', () => {
      const itemId = GRAASP_LINK_ITEM.id;
      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).should('be.checked');

      cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.showLinkButton).equals(false);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });
  });

  describe('File Settings', () => {
    it('Change default maximum width', () => {
      const itemId = IMAGE_ITEM_DEFAULT.id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      // default value
      cy.get(`#${FILE_SETTING_MAX_WIDTH_ID} + input`).should(
        'have.value',
        MaxWidth.ExtraLarge,
      );

      const newMaxWidth = MaxWidth.Small;
      cy.get(`#${FILE_SETTING_MAX_WIDTH_ID}`).click();
      cy.get(`[role="option"][data-value="${newMaxWidth}"]`).click();

      cy.wait('@editItem').then(
        ({
          response: {
            body: { settings },
          },
        }) => {
          expect(settings.maxWidth).equals(newMaxWidth);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getItem').its('response.url').should('contain', itemId);
        },
      );
    });

    it('Shows set maximum width for file', () => {
      const itemId = IMAGE_ITEM_DEFAULT_WITH_MAX_WIDTH.id;

      cy.visit(buildItemPath(itemId));
      cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

      cy.get(`#${FILE_SETTING_MAX_WIDTH_ID} + input`).should(
        'have.value',
        IMAGE_ITEM_DEFAULT_WITH_MAX_WIDTH.settings.maxWidth,
      );
    });
  });
});
