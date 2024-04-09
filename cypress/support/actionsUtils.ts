import {
  ITEM_MENU_DUPLICATE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '@/config/selectors';

const duplicateItem = ({ id }: { id: string }): void => {
  // sorry I need this timeout otherwise the table reload and lose the click..
  // todo: to remove on table refactor
  cy.wait(500);
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_DUPLICATE_BUTTON_CLASS}`).click();
};

export default duplicateItem;
