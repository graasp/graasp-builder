import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID,
} from '../../../../src/config/selectors';
import { createFolder } from '../../../support/createUtils';

describe('Create Folder', () => {
  it('create folder on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    // create
    createFolder({ name: 'created item' });

    cy.wait(['@postItem', '@getAccessibleItems']);
  });

  it('create folder in item', () => {
    const FOLDER = PackedFolderItemFactory();
    const CHILD = PackedFolderItemFactory({ parentItem: FOLDER });
    cy.setUpApi({ items: [FOLDER, CHILD] });
    const { id } = FOLDER;

    // go to children item
    cy.visit(buildItemPath(id));

    // create
    createFolder({ name: 'created item' });

    cy.wait('@postItem').then(({ request: { url } }) => {
      expect(url).to.contain(FOLDER.id);
      // add after child
      expect(url).to.contain(CHILD.id);
    });
  });

  it('cannot create folder with blank name in item', () => {
    // create
    cy.setUpApi();
    cy.visit(HOME_PATH);
    createFolder({ name: ' ' }, { confirm: false });

    cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should(
      'have.prop',
      'disabled',
      true,
    );
  });

  it('description placement should not exist for folder', () => {
    // create
    cy.setUpApi();
    cy.visit(HOME_PATH);
    createFolder({ name: ' ' }, { confirm: false });

    cy.get(`#${ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID}`).should(
      'not.exist',
    );
  });
});
