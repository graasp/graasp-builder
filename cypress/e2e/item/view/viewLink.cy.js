import { buildItemPath } from '../../../../src/config/paths';
import {
  GRAASP_LINK_ITEM,
  GRAASP_LINK_ITEM_IFRAME_ONLY,
  YOUTUBE_LINK_ITEM,
} from '../../../fixtures/links';
import { expectLinkViewScreenLayout } from '../../../support/viewUtils';

describe('Links', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [
        GRAASP_LINK_ITEM,
        GRAASP_LINK_ITEM_IFRAME_ONLY,
        YOUTUBE_LINK_ITEM,
      ],
    });
  });

  it('view some link', () => {
    const { id } = GRAASP_LINK_ITEM;
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    expectLinkViewScreenLayout({ item: GRAASP_LINK_ITEM });
  });

  it('view some link with iframe', () => {
    const { id } = GRAASP_LINK_ITEM_IFRAME_ONLY;
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    expectLinkViewScreenLayout({ item: GRAASP_LINK_ITEM_IFRAME_ONLY });
  });

  it('view youtube', () => {
    const { id } = YOUTUBE_LINK_ITEM;
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    expectLinkViewScreenLayout({ item: YOUTUBE_LINK_ITEM });
  });
});
