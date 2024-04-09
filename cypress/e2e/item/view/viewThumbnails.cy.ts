import { PackedFolderItemFactory } from '@graasp/sdk';

import { HOME_PATH } from '../../../../src/config/paths';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  buildItemCard,
  buildNameCellRendererId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { MEMBERS } from '../../../fixtures/members';
import { ITEM_THUMBNAIL_LINK } from '../../../fixtures/thumbnails/links';

const ITEM_WITHOUT_THUMBNAIL = PackedFolderItemFactory({
  name: 'own_item_name1',
});
const ITEM_WITH_THUMBNAIL = {
  ...PackedFolderItemFactory({
    name: 'own_item_name2',
  }),
  thumbnails: ITEM_THUMBNAIL_LINK,
};

describe('View Thumbnails', () => {
  it(`display thumbnail icons`, () => {
    cy.setUpApi({ items: [ITEM_WITHOUT_THUMBNAIL, ITEM_WITH_THUMBNAIL] });

    cy.visit(HOME_PATH);

    // check default material icon
    // first item doesn't have a thumbnail so it displays the material icon
    cy.get(
      `#${buildNameCellRendererId(ITEM_WITHOUT_THUMBNAIL.id)} svg path`,
    ).should('exist');

    // the second item has a defined thumbnail
    cy.get(`#${buildNameCellRendererId(ITEM_WITH_THUMBNAIL.id)} img`).should(
      'exist',
    );

    // GRID
    cy.switchMode(ItemLayoutMode.Grid);
    // first element has default folder svg
    cy.get(`#${buildItemCard(ITEM_WITH_THUMBNAIL.id)} svg path`).should(
      'exist',
    );

    cy.get(`#${buildItemCard(ITEM_WITH_THUMBNAIL.id)} img`)
      .should('have.attr', 'src')
      .and('contain', ITEM_WITH_THUMBNAIL.thumbnails);
  });

  it(`display member avatar`, () => {
    cy.setUpApi({
      items: [PackedFolderItemFactory()],
      currentMember: MEMBERS.BOB,
    });

    cy.visit(HOME_PATH);

    // display member avatar in header
    cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID} img`)
      .should('have.attr', 'src')
      .and('contain', MEMBERS.BOB.thumbnails);
  });
});
