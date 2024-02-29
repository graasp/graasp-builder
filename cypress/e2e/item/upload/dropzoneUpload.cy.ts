import { buildItemPath } from '@/config/paths';
import { DROPZONE_HELPER_ID } from '@/config/selectors';

import { SAMPLE_ITEMS, SAMPLE_PUBLIC_ITEMS } from '../../../fixtures/items';

describe('home screen - dropzone helper visibility', () => {
  beforeEach(() => {
    cy.setUpApi();
  });

  it('should display dropzone helper on the home screen when no items', () => {
    cy.visit('/');
    cy.get(`#${DROPZONE_HELPER_ID}`).should('be.visible');
  });
});

describe('empty folder - dropzone helper visibility', () => {
  it('user logs in - show dropzone helper when no items', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(buildItemPath(SAMPLE_ITEMS.items[1].id));
    cy.get(`#${DROPZONE_HELPER_ID}`).should('be.visible');
  });

  it('user logs out - hide dropzone helper', () => {
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS, currentMember: null });
    cy.visit(buildItemPath(SAMPLE_PUBLIC_ITEMS.items[2].id));
    cy.get(`#${DROPZONE_HELPER_ID}`).should('not.exist');
  });
});
