import {
  DescriptionPlacement,
  PackedLocalFileItemFactory,
  PackedS3FileItemFactory,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID,
  TEXT_EDITOR_CLASS,
  buildDescriptionPlacementId,
  buildEditButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { MOCK_IMAGE_URL, MOCK_VIDEO_URL } from '../../../fixtures/fileLinks';
import { ICON_FILEPATH, VIDEO_FILEPATH } from '../../../fixtures/files';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from '../../../support/editUtils';
import {
  LocalFileItemForTest,
  S3FileItemForTest,
} from '../../../support/types';

const EDITED_FIELDS = {
  name: 'new name',
};

const IMAGE_ITEM: LocalFileItemForTest = {
  ...PackedLocalFileItemFactory(),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_IMAGE_URL,
};

const VIDEO_ITEM_S3: S3FileItemForTest = {
  ...PackedS3FileItemFactory(),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: VIDEO_FILEPATH,
  readFilepath: MOCK_VIDEO_URL,
};

describe('Edit File', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [IMAGE_ITEM, VIDEO_ITEM_S3] });
  });

  describe('View Page', () => {
    it("edit file's caption", () => {
      const { id } = IMAGE_ITEM;
      cy.visit(buildItemPath(id));
      const caption = 'new caption';
      editCaptionFromViewPage({ id, caption });
      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });

    it('edit description placement to above', () => {
      const { id } = IMAGE_ITEM;
      cy.visit(buildItemPath(id));

      cy.get(`#${buildEditButtonId(id)}`).click();

      cy.get(`#${ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID}`).click();
      cy.get(
        `#${buildDescriptionPlacementId(DescriptionPlacement.ABOVE)}`,
      ).click();
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();

      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        expect(body?.settings).to.contain({
          descriptionPlacement: DescriptionPlacement.ABOVE,
        });
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

    it("cancel file's caption", () => {
      const { id } = IMAGE_ITEM;
      cy.visit(buildItemPath(id));
      cy.get(`#${buildEditButtonId(id)}`).click();
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).click();
      // button should not exist anymore
      cy.get(`.${TEXT_EDITOR_CLASS}`).should('exist');
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).should('not.exist');
    });

    it("cancel s3File's caption", () => {
      const { id } = VIDEO_ITEM_S3;
      cy.visit(buildItemPath(id));
      cy.get(`#${buildEditButtonId(id)}`).click();
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).click();
      // button should not exist anymore
      cy.get(`.${TEXT_EDITOR_CLASS}`).should('exist');
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).should('not.exist');
    });
  });

  describe('List', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);

      cy.switchMode(ItemLayoutMode.List);

      const itemToEdit = IMAGE_ITEM;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ItemLayoutMode.List,
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
          cy.wait('@getAccessibleItems');
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);

      const itemToEdit = VIDEO_ITEM_S3;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ItemLayoutMode.Grid,
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
          cy.wait('@getAccessibleItems');
        },
      );
    });
  });
});
