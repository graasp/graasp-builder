// import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
// import ItemLayoutMode from '../../../../src/enums/itemLayoutModes';
// import { IMAGE_ITEM_DEFAULT, IMAGE_ITEM_S3 } from '../../../fixtures/files';
// import { SAMPLE_ITEMS } from '../../../fixtures/items';
// import { CREATE_ITEM_PAUSE } from '../../../support/constants';
// import { createFile, } from '../../../support/createUtils';

// BUG: These tests work but not in CI

// describe('Create File', () => {
//   it('create file on Home', () => {
//     cy.setUpApi();
//     cy.visit(HOME_PATH);

//     cy.switchMode(ItemLayoutMode.List);

//     // create
//     createFile(IMAGE_ITEM_DEFAULT);

//     cy.wait('@uploadItem').then(() => {
//       // check item is created and displayed
//       cy.wait(CREATE_ITEM_PAUSE);
//       // should update view
//       cy.wait('@getOwnItems');
//     });
//   });

//   it('create file in item', () => {
//     cy.setUpApi(SAMPLE_ITEMS);
//     const { id } = SAMPLE_ITEMS.items[0];

//     // go to children item
//     cy.visit(buildItemPath(id));

//     cy.switchMode(ItemLayoutMode.List);

//     // create
//     createFile(IMAGE_ITEM_S3);

//     cy.wait('@uploadItem').then(() => {
//       // should update view
//       cy.wait('@getItem');
//     });
//   });
// });
