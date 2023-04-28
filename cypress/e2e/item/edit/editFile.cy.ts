import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from '../../../support/editUtils';

describe('Edit File', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3] });
  });

  describe('View Page', () => {
    it("edit file's caption", () => {
      const { id } = IMAGE_ITEM_DEFAULT;
      cy.visit(buildItemPath(id));
      const caption = 'new caption';
      editCaptionFromViewPage({ id, caption });
      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });

    it("edit s3File's caption", () => {
      const { id } = VIDEO_ITEM_S3;
      cy.visit(buildItemPath(id));
      const caption = 'new caption';
      editCaptionFromViewPage({ id, caption });
      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });
  });

  describe('List', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      const itemToEdit = IMAGE_ITEM_DEFAULT;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = VIDEO_ITEM_S3;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });
  });
});
