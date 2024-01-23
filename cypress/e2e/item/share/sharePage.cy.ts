import { Context } from '@graasp/sdk';

import { buildItemSharePath } from '@/config/paths';
import { SHORT_LINK_COMPONENT } from '@/config/selectors';

import { PUBLISHED_ITEM } from '../../../fixtures/items';
import { checkContainPlatformText, checkContainUrlText } from './shareItem.cy';

describe('Display Share Item page', () => {
  describe('Without short links', () => {
    const item = PUBLISHED_ITEM;

    beforeEach(() => {
      cy.setUpApi({ items: [PUBLISHED_ITEM] });
    });

    it('Builder link is correctly displayed', () => {
      cy.visit(buildItemSharePath(item.id));

      cy.get(`.${SHORT_LINK_COMPONENT}`).should('have.length', 3);

      const context = Context.Builder;
      checkContainPlatformText(context);
      checkContainUrlText(context, item.id);
    });
  });
});
