import {
  ItemLoginSchemaStatus,
  ItemLoginSchemaType,
  ItemVisibilityType,
  PackedFolderItemFactory,
  PublicationStatus,
} from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';

import { SETTINGS } from '../../../../src/config/constants';
import {
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
  UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON,
  VISIBILITY_HIDDEN_ALERT_ID,
  buildDataCyWrapper,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import { PublishedItemFactory } from '../../../fixtures/items';

const changeVisibility = (value: string): void => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`, { timeout: 1000 }).click();
};

describe('Visibility of an Item', () => {
  it('Change Private Item to Public', () => {
    const item = PackedFolderItemFactory();
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    const visibilitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visibilitySelect.should('have.value', SETTINGS.ITEM_PRIVATE.name);

    // change private -> public
    changeVisibility(SETTINGS.ITEM_PUBLIC.name);
    cy.wait(`@postItemVisibility-${ItemVisibilityType.Public}`).then(
      ({ request: { url } }) => {
        expect(url).to.contain(item.id);
      },
    );
  });

  it('Change Public Item to Private', () => {
    const item = PackedFolderItemFactory({}, { publicVisibility: {} });
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();
    cy.wait(1000);
    const visibilitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visibilitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);

    // change public -> private
    changeVisibility(SETTINGS.ITEM_PRIVATE.name);
    cy.wait(`@deleteItemVisibility-${ItemVisibilityType.Public}`).then(
      ({ request: { url } }) => {
        expect(url).to.contain(item.id);
      },
    );
  });

  it('Change Public Item to Item Login', () => {
    const item = PackedFolderItemFactory({}, { publicVisibility: {} });
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();
    cy.wait(1000);
    const visibilitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );

    // visibility select default value
    visibilitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);

    // change public -> item login
    changeVisibility(SETTINGS.ITEM_LOGIN.name);
    cy.wait([
      `@deleteItemVisibility-${ItemVisibilityType.Public}`,
      '@putItemLoginSchema',
    ]).then((data) => {
      const {
        request: { url },
      } = data[0];
      expect(url).to.contain(item.id);
      expect(url).to.contain(ItemVisibilityType.Public); // originally item login

      const {
        request: { body, url: itemLoginUrl },
      } = data[1];
      expect(itemLoginUrl).to.contain(item.id);
      expect(body.status).to.contain(ItemLoginSchemaStatus.Active);
    });
  });

  it('Change Pseudonymized Item to Private Item', () => {
    const item = PackedFolderItemFactory();
    const ITEM_LOGIN_ITEM = {
      ...item,
      itemLoginSchema: {
        item,
        type: ItemLoginSchemaType.Username,
        id: 'efaf3d5a-5688-11eb-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    };
    cy.setUpApi({ items: [ITEM_LOGIN_ITEM] });
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
    cy.wait(`@putItemLoginSchema`).then(({ request: { url, body } }) => {
      expect(url).to.include(item.id);
      expect(body.status).to.eq(ItemLoginSchemaStatus.Disabled);
    });
  });

  it('Show hidden alert', () => {
    const item = PackedFolderItemFactory({}, { hiddenVisibility: {} });
    const ITEM_LOGIN_ITEM = {
      ...item,
      itemLoginSchema: {
        item,
        type: ItemLoginSchemaType.Username,
        id: 'efaf3d5a-5688-11eb-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    };
    cy.setUpApi({ items: [ITEM_LOGIN_ITEM] });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();
    cy.get(`#${VISIBILITY_HIDDEN_ALERT_ID}`).should('be.visible');
  });

  describe('Change visibility of published item', () => {
    it('User should validate the change to private', () => {
      const item = PublishedItemFactory(
        PackedFolderItemFactory({}, { publicVisibility: {} }),
      );
      cy.setUpApi({
        items: [item],
        itemPublicationStatus: PublicationStatus.Published,
      });
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();
      const visibilitySelect = cy.get(
        `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
      );

      // visibility select default value
      visibilitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);

      // try to change public -> private
      changeVisibility(SETTINGS.ITEM_PRIVATE.name);
      // the user have to confirm that changing visibility will remove the publication
      cy.get(
        `${buildDataCyWrapper(UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON)}`,
      ).click();
      cy.wait(`@deleteItemVisibility-${ItemVisibilityType.Public}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(item.id);
        },
      );
    });

    it('User should validate the change to item login', () => {
      const item = PublishedItemFactory(
        PackedFolderItemFactory({}, { publicVisibility: {} }),
      );
      cy.setUpApi({
        items: [item],
        itemPublicationStatus: PublicationStatus.Published,
      });
      cy.visit(buildItemPath(item.id));
      cy.get(`#${buildShareButtonId(item.id)}`).click();
      const visibilitySelect = cy.get(
        `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
      );

      // visibility select default value
      visibilitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);

      // try to change public -> item login
      changeVisibility(SETTINGS.ITEM_LOGIN.name);
      // the user have to confirm that changing visibility will remove the publication
      cy.get(
        `${buildDataCyWrapper(UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON)}`,
      ).click();
      cy.wait([
        `@deleteItemVisibility-${ItemVisibilityType.Public}`,
        '@putItemLoginSchema',
      ]).then((data) => {
        const {
          request: { url },
        } = data[0];
        expect(url).to.contain(item.id);
        expect(url).to.contain(ItemVisibilityType.Public); // originally item login

        const {
          request: { url: itemLoginUrl, body },
        } = data[1];
        expect(itemLoginUrl).to.contain(item.id); // originally item login
        expect(body.status).to.eq(ItemLoginSchemaStatus.Active);
      });
    });
  });
});
