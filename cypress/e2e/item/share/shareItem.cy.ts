import { Context, ItemLoginSchemaType, ItemTagType } from '@graasp/sdk';

import shortUUID from 'short-uuid';

import { buildItemPath } from '@/config/paths';

import { SETTINGS } from '../../../../src/config/constants';
import {
  SHARE_ITEM_DIALOG_LINK_ID,
  SHARE_ITEM_DIALOG_LINK_SELECT_ID,
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_LOGIN_ITEMS,
  SAMPLE_ITEMS,
  SAMPLE_PUBLIC_ITEMS,
} from '../../../fixtures/items';
import {
  buildGraaspBuilderView,
  buildGraaspPlayerView,
} from '../../../support/paths';

const openShareItemTab = (id: string) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const changeVisibility = (value: string): void => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`, { timeout: 1000 }).click();
};

describe('Share Item', () => {
  it('Default Private Item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS });
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    const { fromUUID } = shortUUID();
    // sharing link
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'contain',
      `${buildGraaspPlayerView(fromUUID(item.id))}`,
    );
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_SELECT_ID}`).click();
    cy.get(`li[data-value="${Context.Builder}"]`).click();
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'have.text',
      `${buildGraaspBuilderView(fromUUID(item.id))}`,
    );

    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visiblitySelect.should('have.value', SETTINGS.ITEM_PRIVATE.name);

    // change private -> public
    changeVisibility(SETTINGS.ITEM_PUBLIC.name);
    cy.wait(`@postItemTag-${ItemTagType.Public}`).then(
      ({ request: { url } }) => {
        expect(url).to.contain(item.id);
      },
    );
  });

  it('Public Item', () => {
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS });
    // todo: improve type
    const item = SAMPLE_PUBLIC_ITEMS.items[0] as any;
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visiblitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);

    // change public -> private
    changeVisibility(SETTINGS.ITEM_PRIVATE.name);
    cy.wait(`@deleteItemTag-${ItemTagType.Public}`).then(
      ({ request: { url } }) => {
        expect(url).to.contain(item.id);
      },
    );
    // change public -> item login
    changeVisibility(SETTINGS.ITEM_LOGIN.name);
    cy.wait([
      `@deleteItemTag-${ItemTagType.Public}`,
      '@putItemLoginSchema',
    ]).then((data) => {
      const {
        request: { url },
      } = data[0];
      expect(url).to.contain(item.id);
      expect(url).to.contain(ItemTagType.Public); // originally item login
    });
  });

  it('Pseudonymized Item', () => {
    // todo: improve types
    const item = ITEM_LOGIN_ITEMS.items[0] as any;
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // visibility select default value
    cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`).should(
      'have.value',
      SETTINGS.ITEM_LOGIN.name,
    );

    // change item login schema
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID} + input`).should(
      'have.value',
      ItemLoginSchemaType.Username,
    );
    // item login edition is done in itemLogin.cy.js

    // change pseudonymized -> private
    changeVisibility(SETTINGS.ITEM_PRIVATE.name);
    cy.wait(`@deleteItemLoginSchema`).then(({ request: { url } }) => {
      expect(url).to.include(item.id);
    });
  });
});
