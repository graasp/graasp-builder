import {
  buildShareButtonId,
  SHARE_ITEM_DIALOG_LINK_ID,
  SHARE_ITEM_DIALOG_LINK_SELECT_ID,
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
} from '../../../../src/config/selectors';
import {
  buildGraaspBuilderView,
  buildGraaspPlayerView,
  buildItemPath,
} from '../../../../src/config/paths';
import {
  ITEM_LOGIN_ITEMS,
  SAMPLE_ITEMS,
  SAMPLE_PUBLIC_ITEMS,
} from '../../../fixtures/items';
import { SETTINGS, SHARING_LINK_TYPES } from '../../../../src/config/constants';
import {
  DEFAULT_TAGS,
  ITEM_LOGIN_TAG,
  ITEM_PUBLIC_TAG,
} from '../../../fixtures/itemTags';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const changeVisibility = (value) => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`).click();
};

describe('Share Item', () => {
  it('Default Private Item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, tags: DEFAULT_TAGS });
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // sharing link
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'contain',
      `${buildGraaspBuilderView(item.id)}`,
    );
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_SELECT_ID}`).click();
    cy.get(`li[data-value="${SHARING_LINK_TYPES.PLAYER}"]`).click();
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'have.text',
      `${buildGraaspPlayerView(item.id)}`,
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
      expect(body?.tagId).to.equal(ITEM_PUBLIC_TAG.id);
    });
  });

  it('Public Item', () => {
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS, tags: DEFAULT_TAGS });
    const item = SAMPLE_PUBLIC_ITEMS.items[0];
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
      expect(body?.tagId).to.equal(ITEM_LOGIN_TAG.id);
    });
  });

  it('Pseudonymized Item', () => {
    const item = ITEM_LOGIN_ITEMS.items[0];
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visiblitySelect.should('have.value', SETTINGS.ITEM_LOGIN.name);

    // change item login schema
    cy.get(`#${SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID} + input`).should(
      'have.value',
      SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
    );
    // item login edition is done in itemLogin.spec.js
  });
});
