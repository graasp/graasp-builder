import { PackedLinkItemFactory, buildLinkExtra } from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  EDIT_MODAL_ID,
  ITEM_MAIN_CLASS,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
  buildItemsGridMoreButtonSelector,
} from '../../../../src/config/selectors';
import { CURRENT_USER } from '../../../fixtures/members';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from '../../../support/editUtils';

const EDITED_FIELDS = {
  name: 'new name',
};

const GRAASP_LINK_ITEM = PackedLinkItemFactory({
  creator: CURRENT_USER,
  description: 'my link',
  extra: buildLinkExtra({
    url: 'https://graasp.eu',
    html: '',
    thumbnails: ['https://graasp.eu/img/epfl/logo-tile.png'],
    icons: [
      'https://graasp.eu/cdn/img/epfl/favicons/favicon-32x32.png?v=yyxJ380oWY',
    ],
  }),
});

describe('Edit Link', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [GRAASP_LINK_ITEM] });
  });

  describe('View Page', () => {
    it('edit caption', () => {
      const { id } = GRAASP_LINK_ITEM;
      cy.visit(buildItemPath(id));
      const caption = 'new caption';
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

  it('edit link on Home', () => {
    cy.visit(HOME_PATH);

    const itemToEdit = GRAASP_LINK_ITEM;

    // edit
    cy.get(buildItemsGridMoreButtonSelector(itemToEdit.id)).click();
    editItem({
      ...itemToEdit,
      ...EDITED_FIELDS,
    });

    cy.get(buildItemsGridMoreButtonSelector(itemToEdit.id)).click();
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
