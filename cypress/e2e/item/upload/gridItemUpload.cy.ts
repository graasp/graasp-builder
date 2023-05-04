// import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
// import { UPLOADER_ID } from '../../../../src/config/selectors';
// import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
// import { ICON_FILEPATH, TEXT_FILEPATH } from '../../../fixtures/files';
// import { SAMPLE_ITEMS } from '../../../fixtures/items';


// BUG: These tests work but not in CI

// const dragUploadItem = (filenames) =>
//   cy.attachFiles(cy.get(`#${UPLOADER_ID} button input`), filenames, {
//     action: 'drag-drop',
//     force: true,
//   });

// describe('Upload Item in Grid', () => {
//   beforeEach(() => {
//     cy.setUpApi(SAMPLE_ITEMS);
//   });

//   describe('Drag Upload', () => {
//     describe('upload item on Home', () => {
//       beforeEach(() => {
//         cy.visit(HOME_PATH);
//         cy.switchMode(ITEM_LAYOUT_MODES.GRID);
//       });

//       it('upload one file successfully', () => {
//         dragUploadItem([ICON_FILEPATH]).then(() => {
//           cy.wait('@uploadItem').then(() => {
//             // todo: check response

//             // should update view
//             cy.wait('@getOwnItems');
//           });
//         });
//       });

//       it('upload two files successfully', () => {
//         dragUploadItem([ICON_FILEPATH, TEXT_FILEPATH]).then(() => {
//           cy.wait('@uploadItem').then(() => {
//             // todo: check response

//             // should update view
//             cy.wait('@getOwnItems');
//           });
//         });
//       });
//     });
//     describe('upload item in item', () => {
//       const { id } = SAMPLE_ITEMS.items[0];

//       beforeEach(() => {
//         cy.visit(buildItemPath(id));
//         cy.switchMode(ITEM_LAYOUT_MODES.GRID);
//       });

//       it('upload one file successfully', () => {
//         dragUploadItem([ICON_FILEPATH]).then(() => {
//           cy.wait('@uploadItem').then(() => {
//             // todo: check response

//             // should update view
//             cy.wait('@getItem');
//           });
//         });
//       });

//       it('upload two files successfully', () => {
//         dragUploadItem([ICON_FILEPATH, TEXT_FILEPATH]).then(() => {
//           cy.wait('@uploadItem').then(() => {
//             // todo: check response

//             // should update view
//             cy.wait('@getItem');
//           });
//         });
//       });
//     });
//   });
// });
