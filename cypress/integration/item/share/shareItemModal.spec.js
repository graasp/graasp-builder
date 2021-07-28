import {
  ACCESS_INDICATION_ID,
  buildShareButtonId,
  ITEM_MEMBERSHIPS_CONTENT_ID,
  SHARE_ITEM_DIALOG_LINK_ID,
  SHARE_ITEM_DIALOG_LINK_SELECT_ID,
} from '../../../../src/config/selectors';
import {
  buildGraaspComposeView,
  buildGraaspPerformView,
  buildItemPath,
} from '../../../../src/config/paths';
import {
  ITEM_LOGIN_ITEMS,
  SAMPLE_ITEMS,
  SAMPLE_PUBLIC_ITEMS,
} from '../../../fixtures/items';
import { PERFORM_VIEW_SELECTION } from '../../../../src/config/constants';

const openShareItemModal = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

describe('Share Item Modal', () => {
  it('Display Perform or Compose Link', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemModal(item.id);
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'contain',
      `${buildGraaspComposeView(item.id)}`,
    );
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_SELECT_ID}`).click();
    cy.get(`li[data-value="${PERFORM_VIEW_SELECTION}"]`).click();
    cy.get(`#${SHARE_ITEM_DIALOG_LINK_ID}`).should(
      'have.text',
      `${buildGraaspPerformView(item.id)}`,
    );
  });

  it('Display Public Information for public item', () => {
    cy.setUpApi(SAMPLE_PUBLIC_ITEMS);
    const item = SAMPLE_PUBLIC_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemModal(item.id);
    cy.get(`#${ACCESS_INDICATION_ID}`)
      .should('exist')
      .should('contain.text', 'Public');
  });

  it('Display Item Login Information for item with item login', () => {
    cy.setUpApi(ITEM_LOGIN_ITEMS);
    const item = ITEM_LOGIN_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemModal(item.id);
    cy.get(`#${ACCESS_INDICATION_ID}`)
      .should('exist')
      .should('contain.text', 'authenticated with the link');
  });

  it('Display Item Memberships for item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const item = SAMPLE_ITEMS.items[1];
    cy.visit(buildItemPath(item.id));
    openShareItemModal(item.id);
    cy.get(`#${ITEM_MEMBERSHIPS_CONTENT_ID}`).should('exist');
  });
});
