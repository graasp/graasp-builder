import { buildItemPublishPath } from '@/config/paths';
import { ITEM_PUBLISH_BUTTON_ID } from '@/config/selectors';

import {
  PUBLISHED_ITEM,
  PUBLISHED_ITEM_VALIDATIONS,
} from '../../../fixtures/items';

describe('Published Item Page', () => {
  const item = PUBLISHED_ITEM;
  beforeEach(() => {
    cy.setUpApi({
      items: [item],
      itemValidationGroups: PUBLISHED_ITEM_VALIDATIONS,
    });
    cy.visit(buildItemPublishPath(item.id));
  });
  it('Show published state on button', () => {
    // click validate item button
    cy.get(`#${ITEM_PUBLISH_BUTTON_ID} > span`)
      .children()
      .children()
      .should('be.visible');
  });
});
