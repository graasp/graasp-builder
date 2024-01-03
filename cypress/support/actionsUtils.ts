import {
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '@/config/selectors';

const duplicateItem = ({ id }: { id: string }): void => {
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_DUPLICATE_BUTTON_CLASS}`).click();
};

export default duplicateItem;
