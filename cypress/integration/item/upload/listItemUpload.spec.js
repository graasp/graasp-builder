import { DEFAULT_MODE, MODES } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { UPLOADER_ID } from '../../../../src/config/selectors';
import { ICON_FILEPATH, TEXT_FILEPATH } from '../../../fixtures/files';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const dragUploadItem = (filenames) => {
  const files = filenames.map((filePath) => ({ filePath }));
  return cy
    .get(`#${UPLOADER_ID} button`)
    .attachFile(files, { subjectType: 'drag-n-drop' });
};

describe('Upload Item in List', () => {
  beforeEach(() => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
  });

  describe('Drag Upload', () => {
    describe('upload item on Home', () => {
      beforeEach(() => {
        cy.visit(HOME_PATH);
        if (DEFAULT_MODE !== MODES.LIST) {
          cy.switchMode(MODES.LIST);
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
      const { id } = SAMPLE_ITEMS[0];

      beforeEach(() => {
        cy.visit(buildItemPath(id));
        if (DEFAULT_MODE !== MODES.LIST) {
          cy.switchMode(MODES.LIST);
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
