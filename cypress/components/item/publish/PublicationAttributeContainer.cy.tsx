import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton, Tooltip, Typography } from '@mui/material';

import { theme } from '@graasp/ui';

import {
  buildDataCyWrapper,
  buildPublishAttrContainer,
  buildPublishTitleAction,
  buildPublishWarningIcon,
} from '@/config/selectors';

import PublicationAttributeContainer from '../../../../src/components/item/publish/PublicationAttributeContainer';

const ON_EMPTY_SPY = 'onEmptyClick';
const ON_ICON_BTN_SPY = 'onIconBtnClick';
const getSpy = (spy: string) => `@${spy}`;
const eventHandler = {
  onEmptyClick: () => {},
  onIconBtnClick: () => {},
};
const TITLE = 'Categories';
const DATA_CY_ID = 'my-categories';
const CONTENT = <Typography data-cy={DATA_CY_ID}>Category 1</Typography>;
const TITLE_ACTION_BTN = (
  <Tooltip title="Add a category to enhance your element in the library">
    <IconButton onClick={() => eventHandler.onIconBtnClick()}>
      <AddCircleOutlineIcon htmlColor={theme.palette.primary.main} />
    </IconButton>
  </Tooltip>
);

describe('<PublicationAttributeContainer />', () => {
  beforeEach(() => {
    cy.spy(eventHandler, 'onEmptyClick').as(ON_EMPTY_SPY);
    cy.spy(eventHandler, 'onIconBtnClick').as(ON_ICON_BTN_SPY);
  });

  describe('Container is empty', () => {
    beforeEach(() => {
      cy.mount(
        <PublicationAttributeContainer
          dataTestId={DATA_CY_ID}
          title={TITLE}
          titleActionBtn={TITLE_ACTION_BTN}
          onEmptyClick={eventHandler.onEmptyClick}
          emptyDataMessage="Add a category"
          attributeDescription="Add at least one category to better explain the purpose of the published element"
        />,
      );
    });

    it('Warning should be visible', () => {
      cy.get(buildDataCyWrapper(buildPublishWarningIcon(DATA_CY_ID))).should(
        'be.visible',
      );
    });

    it('Empty container should be visisble', () => {
      cy.get(buildDataCyWrapper(buildPublishWarningIcon(DATA_CY_ID))).should(
        'be.visible',
      );
    });

    it('Attribute content should not exist', () => {
      cy.get(buildDataCyWrapper(DATA_CY_ID)).should('not.exist');
    });

    it('Title icon should not exist', () => {
      cy.get(buildDataCyWrapper(buildPublishTitleAction(DATA_CY_ID))).should(
        'not.exist',
      );
    });

    it('Clicking on container should call onEmptyClick', () => {
      cy.get(buildDataCyWrapper(buildPublishAttrContainer(DATA_CY_ID)))
        .should('be.visible')
        .click();
      cy.get(getSpy(ON_EMPTY_SPY)).should('be.calledOnce');
    });
  });

  describe('Container contains data', () => {
    beforeEach(() => {
      cy.mount(
        <PublicationAttributeContainer
          dataTestId={DATA_CY_ID}
          title={TITLE}
          titleActionBtn={TITLE_ACTION_BTN}
          content={CONTENT}
          onEmptyClick={eventHandler.onEmptyClick}
          emptyDataMessage="Add a category"
          attributeDescription="Add at least one category to better explain the purpose of the published element"
        />,
      );
    });

    it('Warning should not exist', () => {
      cy.get(buildDataCyWrapper(buildPublishWarningIcon(DATA_CY_ID))).should(
        'not.exist',
      );
    });

    it('Empty container should not exist', () => {
      cy.get(buildDataCyWrapper(buildPublishWarningIcon(DATA_CY_ID))).should(
        'not.exist',
      );
    });

    it('Attribute content should be visible', () => {
      cy.get(buildDataCyWrapper(DATA_CY_ID)).should('be.visible');
    });

    it('Title icon should be visible', () => {
      cy.get(buildDataCyWrapper(buildPublishTitleAction(DATA_CY_ID))).should(
        'be.visible',
      );
    });

    it('Clicking on container should not call onEmptyClick', () => {
      cy.get(buildDataCyWrapper(buildPublishAttrContainer(DATA_CY_ID)))
        .should('be.visible')
        .click();
      cy.get(getSpy(ON_EMPTY_SPY)).should('not.be.called');
    });

    it('Clicking on icon button should call onEmptyClick', () => {
      cy.get(buildDataCyWrapper(buildPublishTitleAction(DATA_CY_ID)))
        .should('be.visible')
        .click();
      cy.get(getSpy(ON_ICON_BTN_SPY)).should('be.calledOnce');
    });
  });
});
