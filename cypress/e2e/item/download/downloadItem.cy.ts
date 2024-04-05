import { buildDownloadButtonId } from '@/config/selectors';
import { ItemLayoutMode } from '@/enums';

import { buildItemPath } from '../../../../src/config/paths';
import { SAMPLE_PUBLIC_ITEMS } from '../../../fixtures/items';
import { SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';

describe('Download Item', () => {
  it('Table View', () => {
    cy.setUpApi(SHARED_ITEMS);
    cy.wait('@getSharedItems').then(({ response: { body } }) => {
      for (const item of body) {
        cy.get(`#${buildDownloadButtonId(item.id)}`).should('exist');
      }
    });
  });
  it('Grid view', () => {
    cy.setUpApi(SHARED_ITEMS);
    cy.switchMode(ItemLayoutMode.Grid);
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
