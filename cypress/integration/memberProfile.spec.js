import { MEMBER_PROFILE_PATH } from '../../src/config/paths';
import { langs } from '../../src/config/i18n';
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
} from '../../src/config/selectors';
import { CURRENT_USER } from '../fixtures/members';
import { formatDate } from '../../src/utils/date';
import { PASSWORD_CONFIRM_ERROR, PASSWORD_WEAK_ERROR } from '../../src/config/messages';

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
  
  it('Copy member ID to clipboard', () => {
    const { id } = CURRENT_USER;
    
    cy.get(`#${MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID}`).click();
    
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.equal(id);
      });
    });
  });

  it('Enter different passwords', () => {

    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('password1');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).type('password2');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.get('.Toastify__toast-container').should('be.visible');
    cy.get('.Toastify__toast-container').find('div').find('div').find('div').invoke('text')
    .then((text)=>{
      const toastText = text;
      expect(toastText).to.equal(PASSWORD_CONFIRM_ERROR);
    });
  });

  it('Enter weak password', () => {

    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('password');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).type('password');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.get('.Toastify__toast-container').should('be.visible');
    cy.get('.Toastify__toast-container').find('div').find('div').find('div').invoke('text')
    .then((text)=>{
      const toastText = text;
      expect(toastText).to.equal(PASSWORD_WEAK_ERROR);
    });
  });

  it('Update user password', () => {

    cy.get(`#${USER_NEW_PASSWORD_INPUT_ID}`).type('ASDasd123');
    cy.get(`#${USER_CONFIRM_PASSWORD_INPUT_ID}`).type('ASDasd123');

    cy.get(`#${CONFIRM_CHANGE_PASSWORD_BUTTON_ID}`).click();
    cy.wait('@updatePassword').then(({ request: { body } }) => {
      expect(body?.currentPassword).to.equal('');
      expect(body?.password).to.equal('ASDasd123');
    });
  });
});
