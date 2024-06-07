import DebouncedTextField, {
  DEBOUNCE_MS,
} from '@/components/input/DebouncedTextField';
import { DEBOUNCED_TEXT_FIELD_ID } from '@/config/selectors';

const ON_UPDATE_SPY = 'onUpdate';
const getSpyOnUpdate = () => `@${ON_UPDATE_SPY}`;
const eventHandler = {
  onUpdate: (_newValue: string) => {},
};
const LABEL = 'Label';
const VALUE = 'My value';

const getTextArea = () => cy.get(`#${DEBOUNCED_TEXT_FIELD_ID}`);

describe('<DebouncedTextField />', () => {
  beforeEach(() => {
    cy.spy(eventHandler, 'onUpdate').as(ON_UPDATE_SPY);
  });

  describe('Value is defined', () => {
    beforeEach(() => {
      cy.mount(
        <DebouncedTextField
          initialValue={VALUE}
          label={LABEL}
          onUpdate={eventHandler.onUpdate}
        />,
      );
    });
    it('Initial value should not called onUpdate', () => {
      getTextArea().should('be.visible');
      cy.get(getSpyOnUpdate()).should('not.be.called');
    });

    it('Edit value should be called onUpdate', () => {
      const NEW_VALUE = 'My new value';
      getTextArea().clear().type(NEW_VALUE);

      cy.get(getSpyOnUpdate()).should('be.calledOnceWith', NEW_VALUE);
    });

    it('Edit value multiple times should debounce onUpdate', () => {
      const NEW_VALUE = 'My new value';
      getTextArea().clear().type(NEW_VALUE);

      // Write again before the end of the debounce timeout
      const APPEND_VALUE = ' which has been debounced';
      cy.wait(DEBOUNCE_MS - 100);
      getTextArea().type(APPEND_VALUE);
      cy.get(getSpyOnUpdate()).should(
        'be.calledOnceWith',
        `${NEW_VALUE}${APPEND_VALUE}`,
      );
    });
  });

  describe('Can not be empty if not allowed', () => {
    beforeEach(() => {
      cy.mount(
        <DebouncedTextField
          initialValue={VALUE}
          label={LABEL}
          onUpdate={eventHandler.onUpdate}
          required
        />,
      );
    });

    it('Empty value should not call onUpdate if not allowed', () => {
      getTextArea().clear();
      cy.get(getSpyOnUpdate()).should('not.be.called');
    });

    it('onUpdate should be called if value is not empty', () => {
      const NEW_VALUE = 'My new value';
      getTextArea().clear().type(NEW_VALUE);
      cy.get(getSpyOnUpdate()).should('be.calledOnceWith', NEW_VALUE);
    });
  });
});
