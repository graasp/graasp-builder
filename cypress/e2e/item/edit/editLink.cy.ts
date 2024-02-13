import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  EDIT_MODAL_ID,
  ITEM_MAIN_CLASS,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM } from '../../../fixtures/links';
import {
  EDIT_ITEM_PAUSE,
  ITEM_LOADING_PAUSE,
} from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from '../../../support/editUtils';

describe('Edit Link', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM] });
  });

  describe('View Page', () => {
    it('edit caption', () => {
      const { id } = GRAASP_LINK_ITEM;
      cy.visit(buildItemPath(id));
      const caption = 'new caption';
      cy.wait(ITEM_LOADING_PAUSE);
      editCaptionFromViewPage({ id, caption });
      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });

    it('cancel caption', () => {
      const { id, description } = GRAASP_LINK_ITEM;
      cy.visit(buildItemPath(id));
      cy.get(`#${buildEditButtonId(id)}`).click();
      cy.get(`#${EDIT_MODAL_ID} .${TEXT_EDITOR_CLASS}`).type(
        `{selectall}{backspace}`,
      );
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).click();
      cy.get(`.${ITEM_MAIN_CLASS} .${TEXT_EDITOR_CLASS}`)
        .should('exist')
        .and('contain.text', description);
      cy.get(`#${EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}`).should('not.exist');
    });
  });

  describe('List', () => {
    it('edit link on Home', () => {
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      const itemToEdit = GRAASP_LINK_ITEM;

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
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getAccessibleItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit link on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = GRAASP_LINK_ITEM;

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
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getAccessibleItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });
  });
});
