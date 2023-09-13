import { DOWNLOAD_BUTTON_ID } from '@/config/selectors';
import { ITEM_LAYOUT_MODES } from '@/enums';

import { SHARED_ITEMS_PATH } from '../../../../src/config/paths';
import { SHARED_ITEMS } from '../../../fixtures/sharedItems';

describe('check if download button exists for all shared items despite the creator', () => {
  it('Table View', () => {
    cy.setUpApi(SHARED_ITEMS);
    cy.visit(SHARED_ITEMS_PATH);
    cy.wait('@getSharedItems').then(({ response: { body } }) => {
      for (const item of body) {
        cy.get(`#${DOWNLOAD_BUTTON_ID}${item.id}`).should('exist');
      }
    });
  });
  it('Grid view', () => {
    cy.setUpApi(SHARED_ITEMS);
    cy.visit(SHARED_ITEMS_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    cy.wait('@getSharedItems').then(({ response: { body } }) => {
      for (const item of body) {
        cy.get(`#${DOWNLOAD_BUTTON_ID}${item.id}`).should('exist');
      }
    });
  });
});
