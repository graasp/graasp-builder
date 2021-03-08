import { DEFAULT_MODE, MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { UPLOADER_ID } from '../../../../src/config/selectors';
import { SIMPLE_ITEMS } from '../../../fixtures/items';

const ICON_FILEPATH = 'files/icon.png';
const TEXT_FILEPATH = 'files/sometext.txt';

const dragUploadItem = (filenames) => {
  const files = filenames.map((filePath) => ({ filePath }));
  return cy
    .get(`#${UPLOADER_ID} button`)
    .attachFile(files, { subjectType: 'drag-n-drop' });
};

describe('Upload Item in Grid', () => {
  beforeEach(() => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
  });

  describe('Drag Upload', () => {
    describe('upload item on Home', () => {
      beforeEach(() => {
        cy.visit(HOME_PATH);
        if (DEFAULT_MODE !== MODES.GRID) {
          cy.switchMode(MODES.GRID);
        }
      });

      it('upload one file successfully', () => {
        dragUploadItem([ICON_FILEPATH]).then(() => {
          cy.wait('@uploadItem').then(() => {
            // todo: check response

            // should update view
            cy.wait('@getOwnItems');
          });
        });
      });

      it('upload two files successfully', () => {
        dragUploadItem([ICON_FILEPATH, TEXT_FILEPATH]).then(() => {
          cy.wait('@uploadItem').then(() => {
            // todo: check response

            // should update view
            cy.wait('@getOwnItems');
          });
        });
      });
    });
    describe('upload item in item', () => {
      const { id } = SIMPLE_ITEMS[0];

      beforeEach(() => {
        cy.visit(buildItemPath(id));
        if (DEFAULT_MODE !== MODES.GRID) {
          cy.switchMode(MODES.GRID);
        }
      });

      it('upload one file successfully', () => {
        dragUploadItem([ICON_FILEPATH]).then(() => {
          cy.wait('@uploadItem').then(() => {
            // todo: check response

            // should update view
            cy.wait('@getItem');
          });
        });
      });

      it('upload two files successfully', () => {
        dragUploadItem([ICON_FILEPATH, TEXT_FILEPATH]).then(() => {
          cy.wait('@uploadItem').then(() => {
            // todo: check response

            // should update view
            cy.wait('@getItem');
          });
        });
      });
    });
  });
});
