import { MockWebSocket } from '@graasp/query-client';

import { buildItemPath } from '../../../src/config/paths';
import { buildItemsTableRowIdAttribute } from '../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../fixtures/items';
import { WEBSOCKETS_DELAY_TIME } from '../../support/constants';

// parameterized before, to be called in each test or in beforeEach
function beforeWs(
  visitRoute: string,
  sampleData: unknown,
  wsClientStub: MockWebSocket,
) {
  cy.setUpApi(sampleData);
  cy.visit(visitRoute, {
    onBeforeLoad: (win) => {
      cy.stub(win, 'WebSocket').callsFake(() => wsClientStub);
    },
  });
}

describe('Websocket interactions', () => {
  let client: MockWebSocket;

  beforeEach(() => {
    client = new MockWebSocket();
  });

  // describe('sharedWith me items updates', () => {
  //   it('displays sharedWith create update', () => {
  //     beforeWs(SHARED_ITEMS_PATH, { items: [] }, client);

  //     cy.wait(WEBSOCKETS_DELAY_TIME);

  //     const item = SAMPLE_ITEMS.items[0];
  //     cy.wait('@getSharedItems').then(() => {
  //       // send mock sharedItem create update
  //       client.receive({
  //         realm: 'notif',
  //         type: 'update',
  //         topic: 'item/member',
  //         channel: CURRENT_USER.id,
  //         body: {
  //           kind: 'shared',
  //           op: 'create',
  //           item,
  //         },
  //       });
  //     });

  //     cy.wait(WEBSOCKETS_DELAY_TIME);

  //     // assert item is in list
  //     cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
  //   });

  //   it('displays sharedWith delete update', () => {
  //     // create items that do not belong to current user
  //     const items = SAMPLE_ITEMS.items.map((i) => ({
  //       ...i,
  //       creator: 'someoneElse',
  //     }));
  //     const item = items[0];
  //     beforeWs(SHARED_ITEMS_PATH, { items }, client);

  //     cy.get(buildItemsTableRowIdAttribute(item.id)).then(() => {
  //       // send mock sharedItem delete update
  //       client.receive({
  //         realm: 'notif',
  //         type: 'update',
  //         topic: 'item/member',
  //         channel: CURRENT_USER.id,
  //         body: {
  //           kind: 'shared',
  //           op: 'delete',
  //           item,
  //         },
  //       });
  //     });

  //     cy.wait(WEBSOCKETS_DELAY_TIME);
  //     // assert item is not in list anymore
  //     cy.get(buildItemsTableRowIdAttribute(item.id)).should('not.exist');
  //   });
  // });

  describe('childItem updates', () => {
    const { id } = SAMPLE_ITEMS.items[0];

    beforeEach(() => {
      beforeWs(buildItemPath(id), SAMPLE_ITEMS, client);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
        }
      });
    });

    it('displays childItem create update', () => {
      const item = { ...SAMPLE_ITEMS.items[0], id: 'child0' };
      // send mock childItem create update
      client.receive({
        realm: 'notif',
        type: 'update',
        topic: 'item',
        channel: id,
        body: {
          kind: 'child',
          op: 'create',
          item,
        },
      });

      cy.wait(WEBSOCKETS_DELAY_TIME);
      // assert item is in list
      cy.get(buildItemsTableRowIdAttribute(item.id)).should('exist');
    });

    it('displays childItem delete update', () => {
      // this item MUST be a child of id above
      const item = SAMPLE_ITEMS.items[2];
      // send mock childItem delete update
      client.receive({
        realm: 'notif',
        type: 'update',
        topic: 'item',
        channel: id,
        body: {
          kind: 'child',
          op: 'delete',
          item,
        },
      });

      cy.wait(WEBSOCKETS_DELAY_TIME);
      // assert item is not in list
      cy.get(buildItemsTableRowIdAttribute(item.id)).should('not.exist');
    });
  });
});
