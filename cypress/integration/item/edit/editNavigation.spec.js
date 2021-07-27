import { buildItemPath } from '../../../../src/config/paths';
import { buildEditButtonId } from '../../../../src/config/selectors';
import { FOLDER_WITH_TWO_DOCUMENTS } from '../../../fixtures/navigationItems';
import { CAPTION_EDIT_PAUSE } from '../../../support/constants';
import { expectDocumentViewScreenLayout } from '../view/utils';

describe('Edit Navigation', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: FOLDER_WITH_TWO_DOCUMENTS,
    });
  });

  it('Opening Edition mode and closing item reset view', () => {
    const parentItem = FOLDER_WITH_TWO_DOCUMENTS[0];
    const firstItem = FOLDER_WITH_TWO_DOCUMENTS[1];
    const secondItem = FOLDER_WITH_TWO_DOCUMENTS[2];
    cy.visit(buildItemPath(firstItem.id));

    cy.wait(CAPTION_EDIT_PAUSE);
    cy.get(`#${buildEditButtonId(firstItem.id)}`).click();

    cy.goToItemWithNavigation(parentItem.id);
    cy.goToItemInList(secondItem.id);

    expectDocumentViewScreenLayout({ item: secondItem });
  });
});
