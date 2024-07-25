import {
  MEMBER_VALIDATION_BANNER_CLOSE_BUTTON_ID,
  MEMBER_VALIDATION_BANNER_ID,
} from '@/config/selectors';

import {
  LEGACY_NOT_VALIDATED_MEMBER,
  NOT_VALIDATED_MEMBER,
  VALIDATED_MEMBER,
} from '../fixtures/members';

describe('Member validation banner', () => {
  it('Shows banner when member is not validated', () => {
    cy.setUpApi({ currentMember: NOT_VALIDATED_MEMBER });
    cy.visit('/');
    cy.get(`#${MEMBER_VALIDATION_BANNER_ID}`).should('be.visible');
    cy.get(`#${MEMBER_VALIDATION_BANNER_CLOSE_BUTTON_ID}`).click();
  });

  it('Does not show banner when member is validated', () => {
    cy.setUpApi({ currentMember: VALIDATED_MEMBER });
    cy.visit('/');
    cy.get(`#${MEMBER_VALIDATION_BANNER_ID}`).should('not.exist');
  });

  it('Does not show banner when member is legacy', () => {
    cy.setUpApi({ currentMember: LEGACY_NOT_VALIDATED_MEMBER });
    cy.visit('/');
    cy.get(`#${MEMBER_VALIDATION_BANNER_ID}`).should('not.exist');
  });
});
