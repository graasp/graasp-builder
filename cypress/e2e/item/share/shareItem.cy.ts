import { Context, ItemTagType } from '@graasp/sdk'
import { SETTINGS } from '../../../../src/config/constants';
import {
  buildGraaspBuilderView,
  buildGraaspPlayerView,
  buildItemPath,
} from '../../../../src/config/paths';
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

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const changeVisibility = (value: string): void => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`).click();
};

describe('Share Item', () => {
  it('Default Private Item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, });
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // sharing link
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'contain',
      `${buildGraaspPlayerView(item.id)}`,
    );
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_SELECT_ID}`).click();
    cy.get(`li[data-value="${Context.BUILDER}"]`).click();
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'have.text',
      `${buildGraaspBuilderView(item.id)}`,
    );

    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visiblitySelect.should('have.value', SETTINGS.ITEM_PRIVATE.name);

    // change private -> public
    changeVisibility(SETTINGS.ITEM_PUBLIC.name);
    cy.wait('@postItemTag').then(({ request: { body } }) => {
      expect(body?.itemPath).to.equal(item.path);
      expect(body?.type).to.equal(ItemTagType.PUBLIC);
    });

    // change public -> private
    changeVisibility(SETTINGS.ITEM_PRIVATE.name);
    cy.wait('@deleteItemTag').then(() => {
      // we cannot test the select value since the database is not updated
      // eslint-disable-next-line no-unused-expressions
      cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).should('be.visible');
    });
  });

  it('Public Item', () => {
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS, });
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
    cy.wait('@deleteItemTag').then(({ request: { url } }) => {
      expect(url).to.contain(item.tags[0].id);
    });
    // change public -> item login
    changeVisibility(SETTINGS.ITEM_LOGIN.name);
    cy.wait(['@deleteItemTag', '@postItemTag']).then((data) => {
      const {
        request: { url },
      } = data[0];
      expect(url).to.contain(item.tags[0].id);

      const {
        request: { body },
      } = data[1];
      expect(body?.type).to.equal(ItemTagType.PUBLIC); // originally item login
    });
  });

  it('Pseudonymized Item', () => {
    // todo: improve types
    const item = ITEM_LOGIN_ITEMS.items[0] as any;
    cy.setUpApi({ items: [item], });
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
      SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
    );
    // item login edition is done in itemLogin.cy.js

    // change pseudonymized -> private
    changeVisibility(SETTINGS.ITEM_PRIVATE.name);
    cy.wait('@deleteItemTag').then(({ request: { url } }) => {
      expect(url).to.include(item.tags[0].id);
    });
  });
});
