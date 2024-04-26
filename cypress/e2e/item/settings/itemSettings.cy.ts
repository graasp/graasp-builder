import {
  DescriptionPlacement,
  ItemType,
  MaxWidth,
  formatFileSize,
  getFileExtra,
} from '@graasp/sdk';
import { langs } from '@graasp/translations';

import { getMemberById } from '@/utils/member';

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
  ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID,
  LANGUAGE_SELECTOR_ID,
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_LINK_SHOW_BUTTON_ID,
  SETTINGS_LINK_SHOW_IFRAME_ID,
  SETTINGS_PINNED_TOGGLE_ID,
  SETTINGS_SAVE_ACTIONS_TOGGLE_ID,
  buildDescriptionPlacementId,
  buildItemMenu,
  buildItemMenuButtonId,
  buildSettingsButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CHATBOX_MESSAGES,
  ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN,
} from '../../../fixtures/chatbox';
import {
  IMAGE_ITEM_DEFAULT,
  IMAGE_ITEM_DEFAULT_WITH_MAX_WIDTH,
} from '../../../fixtures/files';
import { ITEMS_SETTINGS, SAMPLE_ITEMS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM } from '../../../fixtures/links';
import { MEMBERS } from '../../../fixtures/members';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';

describe('Item Settings', () => {
  describe('read rights', () => {
    beforeEach(() => {
      cy.setUpApi({
        ...SAMPLE_ITEMS,
        currentMember: MEMBERS.BOB,
      });
    });

    it('settings button does not open settings page', () => {
      const item = SAMPLE_ITEMS.items[1];
      // manual click to verify settings button works correctly
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildSettingsButtonId(item.id)}`).should('not.exist');
    });

    it('settings page redirects to item', () => {
      const item = SAMPLE_ITEMS.items[1];
      // manual click to verify settings button works correctly
      cy.visit(buildItemSettingsPath(item.id));
      cy.get(`.${ITEM_MAIN_CLASS}`).should('contain', item.name);
    });
  });

  describe('admin rights', () => {
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
          IMAGE_ITEM_DEFAULT,
        ],
      });
    });

    it('setting button opens settings page', () => {
      const itemId = ITEMS_SETTINGS.items[1].id;
      // manual click to verify settings button works correctly
      cy.visit(buildItemPath(itemId));
      cy.get(`#${buildSettingsButtonId(itemId)}`).click();

      cy.get(`#${SETTINGS_CHATBOX_TOGGLE_ID}`).should('be.checked');
    });

    describe('Metadata table', () => {
      it('folder', () => {
        const { id, name, type, creator } = ITEMS_SETTINGS.items[1];
        cy.visit(buildItemSettingsPath(id));

        cy.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
        cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(type);

        const creatorName = getMemberById(
          Object.values(MEMBERS),
          creator?.id,
        ).name;

        cy.get(`#${ITEM_PANEL_TABLE_ID}`).should('exist').contains(creatorName);
      });

      it('file', () => {
        const { id, name, type, extra, creator } = IMAGE_ITEM_DEFAULT;
        cy.visit(buildItemSettingsPath(id));

        cy.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
        cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(extra.file.mimetype);

        const creatorName = getMemberById(
          Object.values(MEMBERS),
          creator?.id,
        ).name;

        cy.get(`#${ITEM_PANEL_TABLE_ID}`).should('exist').contains(creatorName);

        if (type === ItemType.LOCAL_FILE || type === ItemType.S3_FILE) {
          const { mimetype, size } = getFileExtra(extra);
          cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(mimetype);

          cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(formatFileSize(size));
        }
      });
    });

    describe('Language', () => {
      it('change item language', () => {
        const { id, lang } = ITEMS_SETTINGS.items[1];
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
        const itemId = ITEMS_SETTINGS.items[1].id;

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
        const itemId = ITEMS_SETTINGS.items[2].id;

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
        const itemId = ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN.id;
        // navigate to the item settings
        cy.visit(buildItemSettingsPath(itemId));

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
        const itemId = ITEMS_SETTINGS.items[1].id;

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
        const itemId = ITEMS_SETTINGS.items[2].id;
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
        const itemId = ITEMS_SETTINGS.items[2].id;
        cy.visit(buildItemSettingsPath(itemId));

        cy.get(`#${SETTINGS_SAVE_ACTIONS_TOGGLE_ID}`)
          .should('exist')
          .should('be.disabled')
          .should('not.be.checked');
      });
    });

    describe('Link Settings', () => {
      it('Does not show link settings for folder item', () => {
        const itemId = ITEMS_SETTINGS.items[0].id;

        cy.visit(buildItemSettingsPath(itemId));

        cy.get(`#${SETTINGS_LINK_SHOW_IFRAME_ID}`).should('not.exist');
        cy.get(`#${SETTINGS_LINK_SHOW_BUTTON_ID}`).should('not.exist');
      });

      it('Toggle Iframe', () => {
        const itemId = GRAASP_LINK_ITEM.id;

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
        const itemId = GRAASP_LINK_ITEM.id;
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
        const itemId = IMAGE_ITEM_DEFAULT.id;

        cy.visit(buildItemSettingsPath(itemId));

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

        cy.visit(buildItemSettingsPath(itemId));

        cy.get(`#${FILE_SETTING_MAX_WIDTH_ID} + input`).should(
          'have.value',
          IMAGE_ITEM_DEFAULT_WITH_MAX_WIDTH.settings.maxWidth,
        );
      });
    });

    describe('DescriptionPlacement Settings', () => {
      it('folder should not have description placement', () => {
        const { id, type } = ITEMS_SETTINGS.items[1];
        cy.visit(buildItemSettingsPath(id));

        cy.get(`#${ITEM_PANEL_TABLE_ID}`).contains(type);

        cy.get(`#${ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID}`).should(
          'not.exist',
        );
      });

      it('update placement to above for file', () => {
        const { id } = IMAGE_ITEM_DEFAULT;
        cy.visit(buildItemSettingsPath(id));

        cy.get(`#${ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID}`).click();
        cy.get(
          `#${buildDescriptionPlacementId(DescriptionPlacement.ABOVE)}`,
        ).click();

        cy.wait(`@editItem`).then(({ request: { url, body } }) => {
          expect(url).to.contain(id);
          expect(body?.settings).to.contain({
            descriptionPlacement: DescriptionPlacement.ABOVE,
          });
        });
      });
    });
  });

  describe('in item menu', () => {
    describe('read', () => {
      beforeEach(() => {
        cy.setUpApi({
          ...SAMPLE_ITEMS,
          currentMember: MEMBERS.BOB,
        });
      });
      it('does not have access to settings', () => {
        const itemId = SAMPLE_ITEMS.items[1].id;
        cy.visit('/');
        cy.get(`#${buildItemMenuButtonId(itemId)}`).click();
        cy.get(`#${buildItemMenu(itemId)}`).should('be.visible');
        cy.get(`#${buildSettingsButtonId(itemId)}`).should('not.exist');
      });
    });
    describe('write', () => {
      beforeEach(() => {
        cy.setUpApi({
          ...SAMPLE_ITEMS,
          currentMember: MEMBERS.ALICE,
        });
      });
      it('has access to settings', () => {
        const itemId = SAMPLE_ITEMS.items[1].id;
        cy.visit('/');
        cy.get(`#${buildItemMenuButtonId(itemId)}`).click();
        cy.get(`#${buildItemMenu(itemId)}`).should('be.visible');
        cy.get(`#${buildSettingsButtonId(itemId)}`).should('be.visible');
        cy.get(`#${buildSettingsButtonId(itemId)}`).click();
        cy.url().should('contain', buildItemSettingsPath(itemId));
      });
    });
  });
});
