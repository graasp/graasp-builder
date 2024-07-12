import {
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  buildItemsGridMoreButtonSelector,
} from '@/config/selectors';

const duplicateItem = ({ id }: { id: string }): void => {
  cy.get(buildItemsGridMoreButtonSelector(id)).click();
  cy.get(`.${ITEM_MENU_DUPLICATE_BUTTON_CLASS}`).click();
};

export default duplicateItem;
