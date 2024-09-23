import { FolderItemFactory, MembershipRequestStatus } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';
import {
  MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR,
  REQUEST_MEMBERSHIP_BUTTON_ID,
  buildDataCyWrapper,
} from '@/config/selectors';

import { CURRENT_USER } from '../../../../fixtures/members';

it('Request membership when signed in', () => {
  const item = FolderItemFactory();
  cy.setUpApi({
    items: [item],
  });

  cy.visit(buildItemPath(item.id));

  // click on request button
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).click();

  // check endpoint
  cy.wait('@requestMembership').then(({ request }) => {
    expect(request.url).to.contain(item.id);
  });

  // button is disabled
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('be.disabled');
});

it('Membership request is already sent', () => {
  const item = FolderItemFactory();
  cy.setUpApi({
    items: [item],
    membershipRequests: [
      { item, member: CURRENT_USER, status: MembershipRequestStatus.Pending },
    ],
  });

  cy.visit(buildItemPath(item.id));

  // request pending screen
  cy.get(buildDataCyWrapper(MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR)).should(
    'be.visible',
  );
});
