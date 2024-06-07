import MultiSelectChipInput from '@/components/input/MultiSelectChipInput';
import {
  MULTI_SELECT_CHIP_ADD_BUTTON_ID,
  MULTI_SELECT_CHIP_CONTAINER_ID,
  MULTI_SELECT_CHIP_INPUT_ID,
  buildDataCyWrapper,
  buildMultiSelectChipsSelector,
} from '@/config/selectors';

const ON_SAVE_SPY = 'onSave';
const getSpyOnSave = () => `@${ON_SAVE_SPY}`;
const eventHandler = { onSave: (_values: string[]) => {} };
const EXISTING_VALUES = ['first', 'second', 'third'];
const NEW_VALUE = 'my new value';
const LABEL = 'my label';

const getInput = () =>
  cy.get(`${buildDataCyWrapper(MULTI_SELECT_CHIP_INPUT_ID)} input`);

const addANewValue = (newValue: string) => {
  getInput().type(newValue);
  cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_ADD_BUTTON_ID)).click();
};

const removeAValue = (valueToRemove: string) => {
  const idxOfRemovedValue = EXISTING_VALUES.findIndex(
    (value) => value === valueToRemove,
  );

  if (idxOfRemovedValue === -1) {
    throw new Error(`Given value to remove "${valueToRemove}" was not found!`);
  }

  cy.get(
    `${buildDataCyWrapper(buildMultiSelectChipsSelector(idxOfRemovedValue))} svg`,
  ).click();
};

describe('<MultiSelectChipInput />', () => {
  beforeEach(() => {
    cy.spy(eventHandler, 'onSave').as(ON_SAVE_SPY);
  });

  describe('Data is empty', () => {
    beforeEach(() => {
      cy.mount(
        <MultiSelectChipInput
          data={[]}
          onSave={eventHandler.onSave}
          label={LABEL}
        />,
      );
    });

    it('Chips container should not exist when no data', () => {
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_CONTAINER_ID)).should(
        'not.exist',
      );
    });

    it('Add a new value should add a new chip', () => {
      addANewValue(NEW_VALUE);
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_CONTAINER_ID))
        .children()
        .should('have.length', 1)
        .should('contain', NEW_VALUE);
    });

    it('Add a new value should reset current value', () => {
      addANewValue(NEW_VALUE);
      getInput().should('have.value', '');
    });

    it('Add a new empty value should not be possible', () => {
      getInput().should('have.value', '');
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_ADD_BUTTON_ID)).should(
        'be.disabled',
      );
    });
  });

  describe('Have some data', () => {
    const valueToRemove = EXISTING_VALUES[1];

    beforeEach(() => {
      cy.mount(
        <MultiSelectChipInput
          onSave={eventHandler.onSave}
          data={EXISTING_VALUES}
          label={LABEL}
        />,
      );
    });

    it('Chips container should contains existing chips', () => {
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_CONTAINER_ID))
        .children()
        .should('have.length', EXISTING_VALUES.length);
    });

    it('Add a new value should add a new chip', () => {
      addANewValue(NEW_VALUE);
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_CONTAINER_ID))
        .children()
        .should('have.length', EXISTING_VALUES.length + 1)
        .should('contain', NEW_VALUE);
    });

    it('Add a new value should call onSave', () => {
      addANewValue(NEW_VALUE);
      cy.get(getSpyOnSave()).should('be.calledWith', [
        ...EXISTING_VALUES,
        NEW_VALUE,
      ]);
    });

    it('Add an existing value should not be possible', () => {
      getInput().type(EXISTING_VALUES[0].toUpperCase());
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_ADD_BUTTON_ID)).should(
        'be.disabled',
      );
    });

    it('Add an existing value should not call onSave', () => {
      getInput().type(EXISTING_VALUES[0].toUpperCase());
      cy.get(getSpyOnSave()).should('not.be.called');
    });

    it('Remove a value should remove the chip', () => {
      removeAValue(valueToRemove);
      cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_CONTAINER_ID))
        .children()
        .should('have.length', EXISTING_VALUES.length - 1)
        .should('not.contain', valueToRemove);
    });

    it('Remove a value should call onSave', () => {
      removeAValue(valueToRemove);
      cy.get(getSpyOnSave()).should(
        'be.calledWith',
        EXISTING_VALUES.filter((e) => e !== valueToRemove),
      );
    });
  });
});
