import {
  DocumentItemExtraFlavor,
  DocumentItemFactory,
  ItemType,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import { ITEM_FORM_CONFIRM_BUTTON_ID } from '@/config/selectors';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { createDocument } from '../../../support/createUtils';

describe('Create Document', () => {
  it('create document on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    // create
    const document = DocumentItemFactory({
      extra: { document: { content: 'my content' } },
    });
    createDocument(document);

    cy.wait('@postItem').then(({ request: { body } }) => {
      expect(body.extra.document.content).to.contain(
        document.extra.document.content,
      );
      // should update view
      cy.wait('@getAccessibleItems');
    });
  });

  it('create html document on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    // create
    const document = DocumentItemFactory({
      extra: { document: { content: 'my content', isRaw: true } },
    });
    createDocument(document);

    cy.wait('@postItem').then(({ request: { body } }) => {
      expect(body.extra.document.isRaw).to.equal(true);
      expect(body.extra.document.content).to.equal(
        document.extra.document.content,
      );
      // should update view
      cy.wait('@getAccessibleItems');
    });
  });

  it('create document in item', () => {
    const FOLDER = PackedFolderItemFactory();
    const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
    cy.setUpApi({ items: [FOLDER, CHILD] });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    createDocument(DocumentItemFactory());

    cy.wait('@postItem').then(({ request: { url } }) => {
      expect(url).to.contain(FOLDER.id);
      // add after child
      expect(url).to.contain(CHILD.id);
      // expect update
      cy.wait('@getItem').its('response.url').should('contain', id);
    });
  });

  it('cannot create Document with blank name', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

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

    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
      'have.prop',
      'disabled',
      true,
    );
  });

  it('create document with flavor', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    const documentToCreate = DocumentItemFactory({
      name: 'document',
      extra: {
        [ItemType.DOCUMENT]: {
          content: '<h1>Some Title</h1>',
          flavor: DocumentItemExtraFlavor.Error,
        },
      },
    });
    createDocument(documentToCreate);

    cy.wait('@postItem').then(({ request: { body } }) => {
      expect(body.extra.document.flavor).to.eq(
        documentToCreate.extra.document.flavor,
      );
      expect(body.extra.document.content).to.contain('Some Title');
    });
  });
});
