import { ItemLoginSchemaType, ItemTagType } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

import { SETTINGS } from '../../../../src/config/constants';
import {
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_LOGIN_ITEMS,
  SAMPLE_ITEMS,
  SAMPLE_PUBLIC_ITEMS,
} from '../../../fixtures/items';

const changeVisibility = (value: string): void => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`, { timeout: 1000 }).click();
};

describe('Visibility of an Item', () => {
  it('Change Private Item to Public', () => {
    const item = SAMPLE_ITEMS.items[0];
    cy.setUpApi({ ...SAMPLE_ITEMS });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

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

  it('Change Public Item to Private', () => {
    const item = SAMPLE_PUBLIC_ITEMS.items[0];
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();
    cy.wait(1000);
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
  });

  it('Change Public Item to Item Login', () => {
    const item = SAMPLE_PUBLIC_ITEMS.items[0];
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();
    cy.wait(1000);
    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visiblitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);

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

  it('Change Pseudonymized Item to Private Item', () => {
    const item = ITEM_LOGIN_ITEMS.items[0];
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

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
