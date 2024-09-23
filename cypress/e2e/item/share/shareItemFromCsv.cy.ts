import { PackedFolderItemFactory } from '@graasp/sdk';

import { buildItemSharePath } from '../../../../src/config/paths';
import {
  CSV_FILE_SELECTION_DELETE_BUTTON_ID,
  SHARE_BUTTON_MORE_ID,
  SHARE_CSV_TEMPLATE_SELECTION_BUTTON_ID,
  SHARE_CSV_TEMPLATE_SELECTION_DELETE_BUTTON_ID,
  SHARE_CSV_TEMPLATE_SUMMARY_CONTAINER_ID,
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_SELECTOR,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_CANCEL_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  buildNavigationModalItemId,
} from '../../../../src/config/selectors';
import { MEMBERS } from '../../../fixtures/members';

const shareItem = ({ fixture }: { id: string; fixture: string }) => {
  cy.get(`#${SHARE_BUTTON_MORE_ID}`).click();
  cy.get(`#${SHARE_ITEM_CSV_PARSER_BUTTON_ID}`).click();
  cy.attachFile(
    cy.get(`#${SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_SELECTOR}`),
    fixture,
    { force: true },
  );
};

const ITEMS = [PackedFolderItemFactory(), PackedFolderItemFactory()];

const selectTemplate = (id: string) => {
  cy.get(`#${SHARE_CSV_TEMPLATE_SELECTION_BUTTON_ID}`).click();

  cy.get(`#${buildNavigationModalItemId(id)}`).click();
  cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
};

describe('Share Item From CSV', () => {
  it('simple file without group column', () => {
    const fixture = 'share/simple.csv';
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    const { id } = ITEMS[0];
    cy.visit(buildItemSharePath(id));

    shareItem({ id, fixture });

    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).should(
      'not.be.disabled',
    );
    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).click();
    cy.wait('@uploadCSV');
  });

  it('add file and remove file', () => {
    const fixture = 'share/simple.csv';
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    const { id } = ITEMS[0];
    cy.visit(buildItemSharePath(id));

    shareItem({ id, fixture });

    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).should(
      'not.be.disabled',
    );

    cy.get(`#${CSV_FILE_SELECTION_DELETE_BUTTON_ID}`).click();
    cy.get(`#${SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID}`).should('be.visible');
  });

  it('incorrect columns', () => {
    const fixture = 'share/incorrectColumns.csv';
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    const { id } = ITEMS[0];
    cy.visit(buildItemSharePath(id));

    shareItem({ id, fixture });

    cy.get(`#${SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID}`).should('be.visible');
    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).should('be.disabled');
  });

  it('upload file with groups and select template', () => {
    const fixture = 'share/groups.csv';
    cy.setUpApi({ items: ITEMS, members: Object.values(MEMBERS) });

    const { id } = ITEMS[0];
    cy.visit(buildItemSharePath(id));

    shareItem({ id, fixture });
    const templateItemId = ITEMS[1].id;
    cy.get(`#${SHARE_CSV_TEMPLATE_SELECTION_BUTTON_ID}`).should('be.visible');
    selectTemplate(templateItemId);

    cy.get(`#${SHARE_CSV_TEMPLATE_SELECTION_DELETE_BUTTON_ID}`).should(
      'be.visible',
    );
    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).should('be.enabled');
    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).click();
    cy.wait('@uploadCSV').then(({ request }) => {
      expect(request.query.templateId).equal(templateItemId);
    });
    cy.get(`#${SHARE_CSV_TEMPLATE_SUMMARY_CONTAINER_ID}`)
      .scrollIntoView()
      .should('be.visible');
    cy.get(`#${SHARE_ITEM_FROM_CSV_CANCEL_BUTTON_ID}`).should('be.disabled');
    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).should('be.enabled');
    cy.get(`#${SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}`).click();
  });
});
