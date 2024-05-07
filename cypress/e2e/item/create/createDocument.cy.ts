import {
  DocumentItemFactory,
  ItemType,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import {
  CREATE_ITEM_BUTTON_ID,
  CREATE_ITEM_DOCUMENT_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_DISPLAY_NAME_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
} from '@/config/selectors';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import { createDocument } from '../../../support/createUtils';

describe('Create Document', () => {
  it('create document on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // create
    createDocument(DocumentItemFactory());

    cy.wait('@postItem').then(() => {
      // should update view
      cy.wait('@getAccessibleItems');
    });
  });

  it('create document in item', () => {
    const FOLDER = PackedFolderItemFactory();
    cy.setUpApi({ items: [FOLDER] });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ItemLayoutMode.List);

    // create
    createDocument(DocumentItemFactory());

    cy.wait('@postItem').then(() => {
      // expect update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  it('cannot create Document with blank name', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);
    createDocument(
      DocumentItemFactory({
        name: '',
        extra: {
          [ItemType.DOCUMENT]: {
            content: '<h1>Some Title</h1>',
          },
        },
      }),
      { confirm: false },
    );

    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
      'have.prop',
      'disabled',
      true,
    );
  });

  it('autoComplete document displayName', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    cy.get(`#${CREATE_ITEM_BUTTON_ID}`).click();
    cy.get(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).type('Test Name');
    cy.get(`#${ITEM_FORM_DISPLAY_NAME_INPUT_ID}`).should(
      'have.value',
      'Test Name',
    );
  });
});
