import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM } from '../../../fixtures/links';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from './utils';

describe('Edit Link', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM] });
  });

  describe('View Page', () => {
    it('edit caption', () => {
      cy.visit(buildItemPath(GRAASP_LINK_ITEM.id));
      const caption = 'new caption';
      editCaptionFromViewPage({ caption });
      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(GRAASP_LINK_ITEM.id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });
  });

  describe('List', () => {
    it('edit link on Home', () => {
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

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
          cy.get('@getOwnItems');
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
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });
  });
});
