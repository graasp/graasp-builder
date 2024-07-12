import { HttpMethod, PackedFolderItemFactory } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import { buildItemsTableId } from '../../../../src/config/selectors';
import { ID_FORMAT } from '../../../support/utils';

const PARENT = PackedFolderItemFactory();
const CHILDREN = [
  PackedFolderItemFactory({ parentItem: PARENT }),
  PackedFolderItemFactory({ parentItem: PARENT }),
  PackedFolderItemFactory({ parentItem: PARENT }),
];
const ITEM_REORDER_ITEMS = [PARENT, ...CHILDREN];
const API_HOST = Cypress.env('VITE_GRAASP_API_HOST');

describe('Order Items', () => {
  // todo/bug: difficult to test reordering with drag and drop

  describe('Check default order', () => {
    it('check item order in folder', () => {
      cy.setUpApi({
        items: ITEM_REORDER_ITEMS,
      });

      // mock children call to return ordered items since order is premade by backend
      const orderedItems = [CHILDREN[1], CHILDREN[0], CHILDREN[2]];
      cy.intercept(
        {
          method: HttpMethod.Get,
          url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/children`),
        },
        ({ reply }) => reply(orderedItems),
      ).as('getChildren');

      cy.visit(buildItemPath(PARENT.id));

      cy.get(`#${buildItemsTableId(PARENT.id)}`)
        .find(`h5`)
        .then(($elements) => {
          for (let i = 0; i < $elements.length; i += 1) {
            expect($elements[i].innerText).to.equal(orderedItems[i].name);
          }
        });
    });
  });
});
