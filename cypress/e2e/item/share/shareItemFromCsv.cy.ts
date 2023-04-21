import Papa from 'papaparse';

import { buildItemPath } from '../../../../src/config/paths';
import {
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_SELECTOR,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID,
  buildShareButtonId,
} from '../../../../src/config/selectors';
import { ITEMS_WITH_INVITATIONS } from '../../../fixtures/invitations';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { MEMBERS } from '../../../fixtures/members';

const shareItem = ({ id, fixture }) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
  cy.get(`#${SHARE_ITEM_CSV_PARSER_BUTTON_ID}`).click();
  cy.attachFile(
    cy.get(`#${SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_SELECTOR}`),
    fixture,
    { force: true },
  );
};

describe('Share Item From CSV', () => {
  it('empty csv', () => {
    const fixture = 'share/empty.csv';
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    shareItem({ id, fixture });

    cy.get(`#${SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID}`).should('be.visible');
  });

  it('incorrect columns', () => {
    const fixture = 'share/incorrectColumns.csv';
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    shareItem({ id, fixture });

    cy.get(`#${SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID}`).should('be.visible');
  });

  it('share item from csv with many entries', () => {
    const fixture = 'share/invite.csv';
    cy.setUpApi(ITEMS_WITH_INVITATIONS);

    // go to children item
    const { members: registeredMembers, items } = ITEMS_WITH_INVITATIONS;
    const { id, invitations: itemInvitations } = items[1];
    cy.visit(buildItemPath(id));

    shareItem({ id, fixture });

    cy.fixture(fixture).then((data) => {
      // get content from csv and remove last line: no content
      const { data: csvContent } = Papa.parse(data, { header: true });
      const csv = csvContent.filter(({ name }) => name);

      // david, cedric alredy has an invitation
      // garry is a new invitation
      cy.wait('@postInvitations').then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        const { invitations } = body;
        csv.forEach(({ permission, email }) => {
          const member = registeredMembers.find(
            ({ email: mEmail }) => mEmail === email,
          );
          const invitation = invitations.find(
            ({ email: thisEmail }) => thisEmail === email,
          );
          if (member) {
            expect(invitation).to.equal(undefined);
          } else {
            expect(invitation.permission).to.equal(permission);
          }
        });
      });

      // evan is a new membership
      // fanny is already a membership
      cy.wait('@postManyItemMemberships').then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        const { memberships } = body;
        csv.forEach(({ permission, email }) => {
          const member = registeredMembers.find(
            ({ email: mEmail }) => mEmail === email,
          );
          const membership = memberships.find(
            ({ email: thisEmail }) => thisEmail === email,
          );
          if (member) {
            expect(membership.permission).to.equal(permission);
          } else {
            expect(membership).to.equal(undefined);
          }
        });
      });

      // bob, cedric, david alredy have an invitation
      const duplicateInvitations = itemInvitations.filter(({ email }) =>
        csv.find(({ email: thisEmail }) => thisEmail === email),
      );
      duplicateInvitations.forEach(({ email }) => {
        cy.get(`#${SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID}`)
          .should('be.visible')
          .should('contain', email);
      });
    });
  });
});
