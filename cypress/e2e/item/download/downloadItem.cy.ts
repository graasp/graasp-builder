import { buildDownloadButtonId } from '@/config/selectors';
import { ITEM_LAYOUT_MODES } from '@/enums';

import { SHARED_ITEMS_PATH, buildItemPath } from '../../../../src/config/paths';
import { SAMPLE_PUBLIC_ITEMS } from '../../../fixtures/items';
import { SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';

describe('Download Item', () => {
  it('Table View', () => {
    cy.setUpApi(SHARED_ITEMS);
    cy.visit(SHARED_ITEMS_PATH);
    cy.wait('@getSharedItems').then(({ response: { body } }) => {
      for (const item of body) {
        cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
      }
    });
  });
  it('Grid view', () => {
    cy.setUpApi(SHARED_ITEMS);
    cy.visit(SHARED_ITEMS_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    cy.wait('@getSharedItems').then(({ response: { body } }) => {
      for (const item of body) {
        cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
      }
    });
  });
  it('download button for public item should be exist', () => {
    const currentMember = SIGNED_OUT_MEMBER;
    cy.setUpApi({
      ...SAMPLE_PUBLIC_ITEMS,
      currentMember,
    });
    const item = SAMPLE_PUBLIC_ITEMS.items[4];
    cy.visit(buildItemPath(item.id));
    cy.wait('@getItem').then(({ response: { body } }) => {
      expect(body.id).to.equal(item.id);
      cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
    });
  });
});
