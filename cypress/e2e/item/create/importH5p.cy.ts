import { ItemType, PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  H5P_DASHBOARD_UPLOADER_ID,
} from '../../../../src/config/selectors';
import ItemLayoutMode from '../../../../src/enums/itemLayoutMode';
import { createItem } from '../../../support/createUtils';

const NEW_H5P_ITEM = {
  filepath: 'files/accordion.h5p',
  type: ItemType.H5P,
};

describe('Import H5P', () => {
  it('import h5p on Home', () => {
    cy.setUpApi();
    cy.visit(HOME_PATH);

    cy.switchMode(ItemLayoutMode.List);

    // create

    createItem(NEW_H5P_ITEM);

    // check interface didn't crash
    cy.wait(2000);
    cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('be.visible');
  });

  it('create file in item', () => {
    const FOLDER = PackedFolderItemFactory();

    cy.setUpApi({ items: [FOLDER] });
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    cy.switchMode(ItemLayoutMode.List);

    // create
    createItem(NEW_H5P_ITEM);

    // check interface didn't crash
    cy.wait(3000);
    cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('be.visible');
  });

  it('catch error', () => {
    const FOLDER = PackedFolderItemFactory();

    cy.setUpApi({ items: [FOLDER], importH5pError: true });
    const { id } = FOLDER;
    cy.visit(buildItemPath(id));

    cy.switchMode(ItemLayoutMode.List);

    // create
    createItem(NEW_H5P_ITEM);

    // H5P Upload button is still visible
    cy.wait(3000);
    cy.get(`#${H5P_DASHBOARD_UPLOADER_ID}`).should('be.visible');
  });
});
