import { PackedFolderItemFactory } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  LANGUAGE_SELECTOR_ID,
  LIBRARY_SETTINGS_LANGUAGES_ID,
  buildDataCyWrapper,
  buildPublishAttrContainer,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const LANGUAGE_CHIP_SELECTOR = `${buildDataCyWrapper(
  buildPublishAttrContainer(LIBRARY_SETTINGS_LANGUAGES_ID),
)} [role="button"]`;

const openPublishItemTab = (id: string) =>
  cy.get(`#${buildPublishButtonId(id)}`).click();

const toggleOption = (lang: string) => {
  cy.get(`#${LANGUAGE_SELECTOR_ID}`).click();
  cy.get(`[role="option"][data-value="${lang}"]`).click();
};

const openLanguageModal = () => {
  cy.get(LANGUAGE_CHIP_SELECTOR).click();
};

describe('Item with language', () => {
  const item = PackedFolderItemFactory({ lang: 'fr' });

  beforeEach(() => {
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
  });

  it('Display item language', () => {
    // check for displaying value

    cy.get(LANGUAGE_CHIP_SELECTOR).contains('Français');
  });

  it('Change language', () => {
    openLanguageModal();
    toggleOption('es');

    cy.wait('@editItem').then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.lang).to.eq('es');
    });
  });
});

// users without permission will not see the sections
describe('Languages permissions', () => {
  it('User signed out cannot edit language level', () => {
    const item = PUBLISHED_ITEM;

    cy.setUpApi({
      items: [item],
      currentMember: SIGNED_OUT_MEMBER,
    });
    cy.visit(buildItemPath(item.id));

    // signed out user should not be able to see the publish button
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });

  it('Read-only user cannot edit language level', () => {
    const item = PUBLISHED_ITEM;
    cy.setUpApi({
      items: [item],
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));

    // signed out user should not be able to see the publish button
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });
});
