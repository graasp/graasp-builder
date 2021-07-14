import { buildItemPath } from '../../../../src/config/paths';
import { ITEM_SETTINGS_BUTTON_CLASS } from '../../../../src/config/selectors';
import { FOLDER_WITH_TWO_DOCUMENTS } from '../../../fixtures/navigationItems';
import { expectDocumentViewScreenLayout } from '../view/utils';

describe('Settings Navigation', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: FOLDER_WITH_TWO_DOCUMENTS,
    });
  });

  it('Opening Settings and closing item reset view', () => {
    const parentItem = FOLDER_WITH_TWO_DOCUMENTS[0];
    const firstItem = FOLDER_WITH_TWO_DOCUMENTS[1];
    const secondItem = FOLDER_WITH_TWO_DOCUMENTS[2];
    cy.visit(buildItemPath(firstItem.id));

    cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

    cy.goToItemWithNavigation(parentItem.id);
    cy.goToItemInList(secondItem.id);

    expectDocumentViewScreenLayout({ item: secondItem });
  });
});
