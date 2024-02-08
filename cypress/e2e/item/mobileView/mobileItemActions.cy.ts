import { Context, FlagType, ItemTagType } from '@graasp/sdk';

import { DISPLAY_CO_EDITORS_OPTIONS } from '@/config/constants';

import { buildItemPath } from '../../../../src/config/paths';
import {
  COLLAPSE_ITEM_BUTTON_CLASS,
  EDIT_ITEM_BUTTON_CLASS,
  FAVORITE_ITEM_BUTTON_CLASS,
  HIDDEN_ITEM_BUTTON_CLASS,
  HOME_MODAL_ITEM_ID,
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  ITEM_SETTINGS_BUTTON_CLASS,
  ITEM_SETTINGS_CONTAINER_ID,
  MOBILE_MORE_ACTIONS_BUTTON_ID,
  MODE_GRID_BUTTON_ID,
  PIN_ITEM_BUTTON_CLASS,
  PUBLISH_ITEM_BUTTON_CLASS,
  SHARE_ITEM_BUTTON_CLASS,
  buildCoEditorSettingsRadioButtonId,
  buildDownloadButtonId,
  buildFlagListItemId,
  buildShortLinkUrlTextId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { buildGraaspBuilderView } from '../../../support/paths';

const visitItem = ({ id }: { id: string }) => {
  cy.visit(buildItemPath(id));
  cy.switchMode(ITEM_LAYOUT_MODES.LIST);
};

const mainButtons = [
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_CHATBOX_BUTTON_ID,
  MODE_GRID_BUTTON_ID,
];

describe('check item actions within mobile view', () => {
  beforeEach(() => {
    // run these tests as if in a mobile
    cy.viewport(400, 750);
  });
  it('check view, chat, and info buttons exits', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    mainButtons.forEach((btn) => {
      cy.get(`#${btn}`).should('exist');
    });
  });

  it(`check item edit`, () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${EDIT_ITEM_BUTTON_CLASS}`).click();
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should('exist');
  });

  it('check download button exist', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`#${buildDownloadButtonId(id)}`).should('exist');
  });

  it('check copy button exists and open copy modal', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
    cy.get(`#${HOME_MODAL_ITEM_ID}`).should('exist');
  });

  it('Add Item to favorite from mobile view', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${FAVORITE_ITEM_BUTTON_CLASS}`).click();
    cy.wait('@favoriteItem').then(({ request }) => {
      expect(request.url).to.contain(id);
    });
  });
  it('Share Item Should open share modal and check builder sharing url value', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${SHARE_ITEM_BUTTON_CLASS}`).click();
    cy.get(`#${buildShortLinkUrlTextId(Context.Builder)}`).should(
      'contain',
      buildGraaspBuilderView(id),
    );
  });
  it('Publish Button, check co-editor settings', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${PUBLISH_ITEM_BUTTON_CLASS}`).click();
    Object.values(DISPLAY_CO_EDITORS_OPTIONS).forEach((option) => {
      const displayTags = cy.get(
        `#${buildCoEditorSettingsRadioButtonId(option.value)}`,
      );
      displayTags.should('be.visible');
    });
  });
  it('Shortcut button should open modal', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${ITEM_MENU_SHORTCUT_BUTTON_CLASS}`).click();
    cy.get(`#${HOME_MODAL_ITEM_ID}`).should('exist');
  });
  it('hide item', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${HIDDEN_ITEM_BUTTON_CLASS}`).click();
    cy.wait(`@postItemTag-${ItemTagType.Hidden}`).then(
      ({ request: { url } }) => {
        expect(url).to.contain(ItemTagType.Hidden);
        expect(url).to.contain(id);
      },
    );
  });
  it('collapse item', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${COLLAPSE_ITEM_BUTTON_CLASS}`).click();
    cy.wait('@editItem').then(
      ({
        response: {
          body: { id: payloadId, settings },
        },
      }) => {
        expect(payloadId).to.equal(id);
        expect(settings.isCollapsible).equals(true);
      },
    );
  });
  it('Pin item', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });

    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${PIN_ITEM_BUTTON_CLASS}`).click();
    cy.wait(`@editItem`).then(
      ({
        request: {
          body: { settings },
        },
      }) => {
        expect(settings.isPinned).equals(true);
      },
    );
  });
  it.only('Recycle item', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });
    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${ITEM_MENU_RECYCLE_BUTTON_CLASS}`).click();

    cy.wait('@recycleItems').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
  });
  it('Flag item false information option should exist', () => {
    const { id } = SAMPLE_ITEMS.items[1];
    const type = FlagType.FalseInformation;

    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });
    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${ITEM_MENU_FLAG_BUTTON_CLASS}`).click();
    cy.get(`#${buildFlagListItemId(type)}`).should('exist');
  });
  it('Item settings', () => {
    const { id } = SAMPLE_ITEMS.items[1];

    cy.setUpApi(SAMPLE_ITEMS);
    visitItem({ id });
    cy.get(`#${MOBILE_MORE_ACTIONS_BUTTON_ID}`).click();
    cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();
    cy.get(`#${ITEM_SETTINGS_CONTAINER_ID}`).should('exist');
  });
});
