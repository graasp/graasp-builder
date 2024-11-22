import {
  ItemType,
  MaxWidth,
  MimeTypes,
  PackedFolderItemFactory,
  PackedLinkItemFactory,
  PackedLocalFileItemFactory,
  PermissionLevel,
  formatFileSize,
  getFileExtra,
} from '@graasp/sdk';
import { langs } from '@graasp/translations';

import {
  buildItemPath,
  buildItemSettingsPath,
} from '../../../../src/config/paths';
import {
  CLEAR_CHAT_CONFIRM_BUTTON_ID,
  CLEAR_CHAT_DIALOG_ID,
  CLEAR_CHAT_SETTING_ID,
  DOWNLOAD_CHAT_BUTTON_ID,
  FILE_SETTING_MAX_WIDTH_ID,
  ITEM_MAIN_CLASS,
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
  LANGUAGE_SELECTOR_ID,
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_LINK_SHOW_BUTTON_ID,
  SETTINGS_LINK_SHOW_IFRAME_ID,
  SETTINGS_PINNED_TOGGLE_ID,
  SETTINGS_SAVE_ACTIONS_TOGGLE_ID,
  buildItemsGridMoreButtonSelector,
  buildSettingsButtonId,
} from '../../../../src/config/selectors';
import { ITEM_WITH_CHATBOX_MESSAGES } from '../../../fixtures/chatbox';
import { CURRENT_USER, MEMBERS } from '../../../fixtures/members';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';

describe('Item Settings', () => {
  describe('read rights', () => {
    const item = PackedFolderItemFactory(
      {},
      { permission: PermissionLevel.Read },
    );

    beforeEach(() => {
      cy.setUpApi({
        items: [item],
        currentMember: MEMBERS.BOB,
      });
    });

    it('settings button does not open settings page', () => {
      // manual click to verify settings button works correctly
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildSettingsButtonId(item.id)}`).should('not.exist');
    });

    it('settings page redirects to item', () => {
      // manual click to verify settings button works correctly
      cy.visit(buildItemSettingsPath(item.id));
      // name could have ellipsis
      cy.get(`.${ITEM_MAIN_CLASS}`).should('contain', item.name.slice(0, 10));
    });
  });

  describe('admin rights', () => {
    it('setting button opens settings page', () => {
      const item = PackedFolderItemFactory({ settings: { showChatbox: true } });
      cy.setUpApi({ items: [item] });
      // manual click to verify settings button works correctly
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildSettingsButtonId(item.id)}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).should('be.checked');
    });

    describe('Metadata table', () => {
      it('folder', () => {
        const item = PackedFolderItemFactory({ creator: MEMBERS.BOB });
        const { id, name, type, creator } = item;
        cy.setUpApi({ items: [item] });

        cy.visit(buildItemSettingsPath(id));

        cy.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
        cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(type);

        cy.get(`#${ITEM_PANEL_TABLE_ID}`)
          .should('exist')
          .contains(creator.name);
      });

      it('file', () => {
        const FILE = PackedLocalFileItemFactory({ creator: MEMBERS.BOB });
        cy.setUpApi({ items: [FILE] });

        const { id, name, type, extra, creator } = FILE;
        cy.visit(buildItemSettingsPath(id));

        cy.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
        cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(extra.file.mimetype);

        cy.get(`#${ITEM_PANEL_TABLE_ID}`)
          .should('exist')
          .contains(creator.name);

        if (type === ItemType.LOCAL_FILE || type === ItemType.S3_FILE) {
          const { mimetype, size } = getFileExtra(extra);
          cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(mimetype);

          cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(formatFileSize(size));
        }
      });
    });

    describe('Language', () => {
      it('change item language', () => {
        const FILE = PackedLocalFileItemFactory();
        cy.setUpApi({ items: [FILE] });
        const { id, lang } = FILE;
        cy.visit(buildItemSettingsPath(id));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const langName = langs[lang];
        cy.get(`#${LANGUAGE_SELECTOR_ID}`).should('contain', langName);
        cy.get(`#${LANGUAGE_SELECTOR_ID}`).click();
        cy.get(`[role="option"][data-value="de"]`).click();

        cy.wait('@editItem').then(({ request: { body } }) => {
          expect(body.lang).to.equal('de');
        });
      });
    });

    describe('Chatbox Settings', () => {
      it('Disabling Chatbox', () => {
        const FILE = PackedLocalFileItemFactory({
          settings: { showChatbox: true },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

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
        const FILE = PackedLocalFileItemFactory({
          settings: { showChatbox: false },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

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

      it('Clear Chat', () => {
        const item = PackedFolderItemFactory();
        const ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN = {
          ...item,
          chat: [
            {
              id: '78ad2166-3862-4593-a10c-d380e7b66674',
              body: 'message1',
              item,
              createdAt: '2021-08-11T12:56:36.834Z',
              updatedAt: '2021-08-11T12:56:36.834Z',
              creator: CURRENT_USER,
            },
            {
              id: '78ad1166-3862-1593-a10c-d380e7b66674',
              body: 'message2',
              item,
              createdAt: '2021-08-11T12:56:36.834Z',
              updatedAt: '2021-08-11T12:56:36.834Z',
              creator: MEMBERS.BOB,
            },
          ],
        };
        cy.setUpApi({ items: [ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN] });

        // navigate to the item settings
        cy.visit(buildItemSettingsPath(item.id));

        // click on the clear chat button
        cy.get(`#${CLEAR_CHAT_SETTING_ID}`).scrollIntoView();
        cy.get(`#${CLEAR_CHAT_SETTING_ID}`).should('exist').and('be.visible');
        cy.get(`#${CLEAR_CHAT_SETTING_ID}`).click();

        // check that the dialog is open
        cy.get(`#${CLEAR_CHAT_DIALOG_ID}`);

        // check that the buttons are there
        cy.get(`#${CLEAR_CHAT_CONFIRM_BUTTON_ID}`)
          .should('exist')
          .and('be.visible')
          .click();

        cy.wait('@clearItemChat');
      });

      it('Unauthorized to clear Chat', () => {
        cy.setUpApi({ items: [ITEM_WITH_CHATBOX_MESSAGES] });

        const itemId = ITEM_WITH_CHATBOX_MESSAGES.id;
        // navigate to the item settings
        cy.visit(buildItemSettingsPath(itemId));

        // check that the clear button is not shown
        cy.get(`#${CLEAR_CHAT_SETTING_ID}`).should('not.exist');

        // check that the download button is not shown
        cy.get(`#${DOWNLOAD_CHAT_BUTTON_ID}`).should('not.exist');
      });
    });

    describe('Pinned Settings', () => {
      it('Unpin items', () => {
        const FILE = PackedLocalFileItemFactory({
          settings: { isPinned: true },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

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
        const FILE = PackedLocalFileItemFactory({
          settings: { isPinned: false },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;
        cy.visit(buildItemSettingsPath(itemId));
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
        const FILE = PackedLocalFileItemFactory();
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;
        cy.visit(buildItemSettingsPath(itemId));

        cy.get(`#${SETTINGS_SAVE_ACTIONS_TOGGLE_ID}`)
          .should('exist')
          .should('be.disabled');
      });
    });

    describe('Link Settings', () => {
      it('Does not show link settings for folder item', () => {
        const FILE = PackedFolderItemFactory();
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

        cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).should('not.exist');
        cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).should('not.exist');
      });

      it('Toggle Iframe', () => {
        const FILE = PackedLinkItemFactory({
          settings: { showLinkIframe: false },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

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
        const FILE = PackedLinkItemFactory({
          settings: { showLinkIframe: true },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;
        cy.visit(buildItemSettingsPath(itemId));

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
        const FILE = PackedLocalFileItemFactory({
          extra: {
            [ItemType.LOCAL_FILE]: {
              mimetype: MimeTypes.Image.JPEG,
              size: 30,
              name: 'name',
              path: 'path',
              content: '',
            },
          },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

        // default value
        cy.get(`#${FILE_SETTING_MAX_WIDTH_ID} + input`).should(
          'have.value',
          'default',
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
        const FILE = PackedLocalFileItemFactory({
          extra: {
            [ItemType.LOCAL_FILE]: {
              mimetype: MimeTypes.Image.JPEG,
              size: 30,
              name: 'name',
              path: 'path',
              content: '',
            },
          },
          settings: {
            maxWidth: MaxWidth.Large,
          },
        });
        cy.setUpApi({ items: [FILE] });
        const { id: itemId } = FILE;

        cy.visit(buildItemSettingsPath(itemId));

        cy.get(`#${FILE_SETTING_MAX_WIDTH_ID} + input`).should(
          'have.value',
          FILE.settings.maxWidth,
        );
      });
    });
  });

  describe('in item menu', () => {
    describe('read', () => {
      const item = PackedFolderItemFactory(
        {},
        { permission: PermissionLevel.Read },
      );
      const itemId = item.id;
      beforeEach(() => {
        cy.setUpApi({
          items: [item],
          currentMember: MEMBERS.BOB,
        });
        cy.visit('/');
      });
      it('does not have access to settings', () => {
        cy.get(buildItemsGridMoreButtonSelector(itemId)).click();
        cy.get(`#${buildSettingsButtonId(itemId)}`).should('not.exist');
      });
    });
    describe('write', () => {
      const item = PackedFolderItemFactory(
        {},
        { permission: PermissionLevel.Admin },
      );
      const itemId = item.id;
      beforeEach(() => {
        cy.setUpApi({
          items: [item],
          currentMember: MEMBERS.ALICE,
        });
        cy.visit('/');
      });
      it('has access to settings', () => {
        cy.get(buildItemsGridMoreButtonSelector(itemId)).click();
        cy.get(`#${buildSettingsButtonId(itemId)}`).should('be.visible');
        cy.get(`#${buildSettingsButtonId(itemId)}`).click();
        cy.url().should('contain', buildItemSettingsPath(itemId));
      });
    });
  });
});
