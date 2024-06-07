import {
  buildDataCyWrapper,
  buildLibraryAddButtonHeader,
  buildPublishAttrContainer,
  buildPublishChip,
} from '@/config/selectors';

import PublicationChipContainer from '../../../../src/components/item/publish/PublicationChipContainer';

const ON_ADD_SPY = 'onAddClicked';
const ON_DELETE_SPY = 'onChipDelete';
const getSpy = (spy: string) => `@${spy}`;
const eventHandler = {
  onAddClicked: () => {},
  onChipDelete: () => {},
};
const TITLE = 'Categories';
const ATTRIBUTE_DESCRIPTION =
  'Add a category to enhance your element in the library';
const DATA = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
const DATA_CY_ID = 'dataCyId';

describe('<PublicationChipContainer />', () => {
  beforeEach(() => {
    cy.spy(eventHandler, 'onAddClicked').as(ON_ADD_SPY);
    cy.spy(eventHandler, 'onChipDelete').as(ON_DELETE_SPY);
  });

  describe('Container is empty', () => {
    beforeEach(() => {
      cy.mount(
        <PublicationChipContainer
          title={TITLE}
          dataTestId={DATA_CY_ID}
          attributeDescription={ATTRIBUTE_DESCRIPTION}
          emptyDataMessage="Add a category"
          onAddClicked={eventHandler.onAddClicked}
          onChipDelete={eventHandler.onChipDelete}
        />,
      );
    });
    it('Clicking on container should call onAddClicked', () => {
      cy.get(buildDataCyWrapper(buildPublishAttrContainer(DATA_CY_ID)))
        .should('be.visible')
        .click();
      cy.get(getSpy(ON_ADD_SPY)).should('be.calledOnce');
    });
  });

  describe('Container is not empty', () => {
    beforeEach(() => {
      cy.mount(
        <PublicationChipContainer
          title={TITLE}
          dataTestId={DATA_CY_ID}
          attributeDescription={ATTRIBUTE_DESCRIPTION}
          emptyDataMessage="Add a category"
          onAddClicked={eventHandler.onAddClicked}
          onChipDelete={eventHandler.onChipDelete}
          data={DATA}
        />,
      );
    });
    it('Clicking on add button should call onAddClicked', () => {
      cy.get(
        buildDataCyWrapper(buildLibraryAddButtonHeader(DATA_CY_ID)),
      ).click();
      cy.get(getSpy(ON_ADD_SPY)).should('be.calledOnce');
    });
    it('Deleting a chip should call onChipDelete', () => {
      cy.get(`${buildDataCyWrapper(buildPublishChip(DATA[0]))} svg`).click();
      cy.get(getSpy(ON_DELETE_SPY)).should('be.calledOnce');
    });
  });
});
