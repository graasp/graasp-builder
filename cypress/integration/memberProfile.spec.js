import { MEMBER_PROFILE_PATH } from '../../src/config/paths';
import { langs } from '../../src/config/i18n';
import {
  MEMBER_PROFILE_MEMBER_ID_ID,
  MEMBER_PROFILE_MEMBER_NAME_ID,
  MEMBER_PROFILE_EMAIL_ID,
  MEMBER_PROFILE_LANGUAGE_SWITCH_ID,
  MEMBER_PROFILE_INSCRIPTION_DATE_ID,
  MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID,
} from '../../src/config/selectors';
import { CURRENT_USER } from '../fixtures/members';
import { formatDate } from '../../src/utils/date';

describe('Member Profile', () => {
  beforeEach(() => {
    cy.setUpApi();
    cy.visit(MEMBER_PROFILE_PATH);
  });

  it('Layout', () => {
    const { id, name, email, extra, createdAt } = CURRENT_USER;
    cy.get(`#${MEMBER_PROFILE_MEMBER_ID_ID}`).should('contain', id);
    cy.get(`#${MEMBER_PROFILE_MEMBER_NAME_ID}`).should('contain', name);
    cy.get(`#${MEMBER_PROFILE_EMAIL_ID}`).should('contain', email);
    cy.get(`#${MEMBER_PROFILE_INSCRIPTION_DATE_ID}`).should(
      'contain',
      formatDate(createdAt),
    );
    cy.get(`#${MEMBER_PROFILE_LANGUAGE_SWITCH_ID}`).should(
      'contain',
      langs[extra.lang],
    );
  });

  it('Changing Language edits user', () => {
    const { id } = CURRENT_USER;

    cy.get(`#${MEMBER_PROFILE_LANGUAGE_SWITCH_ID}`).select('en');

    cy.wait('@editMember').then(({ request: { body, url } }) => {
      expect(url).to.contain(id);
      expect(body?.extra?.lang).to.equal('en');
    });
  });

  it('Copy member ID to clipboard', () => {
    const { id } = CURRENT_USER;

    cy.get(`#${MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID}`).click();

    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.equal(id);
      });
    });
  });
});
