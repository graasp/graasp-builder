import { MEMBER_PROFILE_PATH } from '../../src/config/paths';
import { langs } from '../../src/config/i18n';
import { emailFrequency } from '../../src/config/constants';
import {
  MEMBER_PROFILE_MEMBER_ID_ID,
  MEMBER_PROFILE_MEMBER_NAME_ID,
  MEMBER_PROFILE_EMAIL_ID,
  MEMBER_PROFILE_LANGUAGE_SWITCH_ID,
  MEMBER_PROFILE_INSCRIPTION_DATE_ID,
  MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID,
  USER_NEW_PASSWORD_INPUT_ID,
  USER_CONFIRM_PASSWORD_INPUT_ID,
  USER_CURRENT_PASSWORD_INPUT_ID,
  CONFIRM_CHANGE_PASSWORD_BUTTON_ID,
  MEMBER_PROFILE_EMAIL_FREQ_SWITCH_ID,
} from '../../src/config/selectors';
import { CURRENT_USER } from '../fixtures/members';
import { formatDate } from '../../src/utils/date';

describe('Member Profile', () => {
  beforeEach(() => {
    cy.setUpApi();
    cy.visit(MEMBER_PROFILE_PATH, {
      onBeforeLoad(win) {
        cy.spy(win.navigator.clipboard, 'writeText').as('copy');
      },
    });
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
    cy.get(`#${MEMBER_PROFILE_EMAIL_FREQ_SWITCH_ID}`).should(
      'contain',
      emailFrequency[extra.emailFreq],
    );
    cy.get(`#${USER_CURRENT_PASSWORD_INPUT_ID}`).should('be.visible');
    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).should('be.visible');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).should('be.visible');
    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).should('be.visible');
  });

  it('Changing Language edits user', () => {
    const { id } = CURRENT_USER;

    cy.get(`#${MEMBER_PROFILE_LANGUAGE_SWITCH_ID}`).select('en');

    cy.wait('@editMember').then(({ request: { body, url } }) => {
      expect(url).to.contain(id);
      expect(body?.extra?.lang).to.equal('en');
    });
  });

  it('Changing Email frequency edits user', () => {
    const { id } = CURRENT_USER;

    cy.get(`#${MEMBER_PROFILE_EMAIL_FREQ_SWITCH_ID}`).select('always');

    cy.wait('@editMember').then(({ request: { body, url } }) => {
      expect(url).to.contain(id);
      expect(body?.extra?.emailFreq).to.equal('always');
    });
  });

  it('Copy member ID to clipboard', () => {
    const { id } = CURRENT_USER;

    cy.get(`#${MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID}`).click();

    cy.get('@copy').should('be.calledWithExactly', id);
  });

  it('Throw error with empty password', () => {
    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('password1');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.get('#confirmPasswordInput-helper-text').should('be.visible');
    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).clear();
    cy.get('#newPasswordInput-helper-text').should('be.visible');
  });

  it('Not trigger request with same current password', () => {
    Cypress.on('fail', (error) => {
      if (error.message.indexOf('Timed out retrying') !== 0) throw error;
    });

    cy.get(`#${USER_CURRENT_PASSWORD_INPUT_ID}`).type('password1');
    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('password1');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.wait('@updatePassword', {
      requestTimeout: 1000,
    }).then((xhr) => {
      expect.isNull(xhr.response.body);
    });
  });

  it('Not trigger request with diffferent passwords', () => {
    Cypress.on('fail', (error) => {
      if (error.message.indexOf('Timed out retrying') !== 0) throw error;
    });

    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('password1');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).type('password2');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.wait('@updatePassword', {
      requestTimeout: 1000,
    }).then((xhr) => {
      expect.isNull(xhr.response.body);
    });
  });

  it('Not trigger request with weak password', () => {
    Cypress.on('fail', (error) => {
      if (error.message.indexOf('Timed out retrying') !== 0) throw error;
    });

    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('password');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).type('password');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.wait('@updatePassword', {
      requestTimeout: 1000,
    }).then((xhr) => {
      expect.isNull(xhr.response.body);
    });
  });

  it('Update user password correctly', () => {
    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('ASDasd123');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).type('ASDasd123');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.wait('@updatePassword').then(({ request: { body } }) => {
      expect(body?.currentPassword).to.equal('');
      expect(body?.password).to.equal('ASDasd123');
    });
  });
});
