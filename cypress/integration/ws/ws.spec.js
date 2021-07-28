import { WebSocket } from '@graasp/websockets/test/mock-client';
import { buildItemPath, SHARED_ITEMS_PATH } from '../../../src/config/paths';
import { buildItemsTableRowId } from '../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../fixtures/items';
import { CURRENT_USER } from '../../fixtures/members';
import { WEBSOCKETS_DELAY_TIME } from '../../support/constants';

// paramaterized before, to be called in each test or in beforeEach
function beforeWs(visitRoute, sampleData, wsClientStub) {
  cy.setUpApi(sampleData);
  cy.visit(visitRoute, {
    onBeforeLoad: (win) => {
      cy.stub(win, 'WebSocket', () => wsClientStub);
    },
  });
}

describe('Websocket interactions', () => {
  let client;

  beforeEach(() => {
    client = new WebSocket();
  });

  describe('sharedWith me items updates', () => {
    it('displays sharedWith create update', () => {
      beforeWs(SHARED_ITEMS_PATH, { items: [] }, client);

      cy.wait(WEBSOCKETS_DELAY_TIME);

      const item = SAMPLE_ITEMS.items[0];
      cy.wait('@getSharedItems').then(() => {
        // send mock sharedItem create update
        client.receive({
          realm: 'notif',
          type: 'update',
          channel: CURRENT_USER.id,
          body: {
            entity: 'member',
            kind: 'sharedWith',
            op: 'create',
            value: item,
          },
        });
      });

      cy.wait(WEBSOCKETS_DELAY_TIME);

      // assert item is in list
      cy.get(`[row-id = "${buildItemsTableRowId(item.id)}"]`).should('exist');
    });

    it('displays sharedWith delete update', () => {
      // create items that do not belong to current user
      const items = SAMPLE_ITEMS.items.map((i) => ({
        ...i,
        creator: 'someoneElse',
      }));
      const item = items[0];
      beforeWs(SHARED_ITEMS_PATH, { items }, client);

      cy.get(`[row-id = "${buildItemsTableRowId(item.id)}"]`).then(() => {
        // send mock sharedItem delete update
        client.receive({
          realm: 'notif',
          type: 'update',
          channel: CURRENT_USER.id,
          body: {
            entity: 'member',
            kind: 'sharedWith',
            op: 'delete',
            value: item,
          },
        });
      });

      cy.wait(WEBSOCKETS_DELAY_TIME);
      // assert item is not in list anymore
      cy.get(`[row-id = "${buildItemsTableRowId(item.id)}"]`).should(
        'not.exist',
      );
    });
  });

  describe('childItem updates', () => {
    const { id } = SAMPLE_ITEMS.items[0];

    beforeEach(() => {
      beforeWs(buildItemPath(id), SAMPLE_ITEMS, client);

      // should get children
      cy.wait('@getChildren').then(({ response: { body } }) => {
        // check item is created and displayed
        for (const item of body) {
          cy.get(`[row-id = "${buildItemsTableRowId(item.id)}"]`).should(
            'exist',
          );
        }
      });
    });

    it('displays childItem create update', () => {
      const item = { ...SAMPLE_ITEMS.items[0], id: 'child0' };
      // send mock childItem create update
      client.receive({
        realm: 'notif',
        type: 'update',
        channel: id,
        body: {
          entity: 'item',
          kind: 'childItem',
          op: 'create',
          value: item,
        },
      });

      cy.wait(WEBSOCKETS_DELAY_TIME);
      // assert item is in list
      cy.get(`[row-id = "${buildItemsTableRowId(item.id)}"]`).should('exist');
    });

    it('displays childItem delete update', () => {
      // this item MUST be a child of id above
      const item = SAMPLE_ITEMS.items[2];
      // send mock childItem delete update
      client.receive({
        realm: 'notif',
        type: 'update',
        channel: id,
        body: {
          entity: 'item',
          kind: 'childItem',
          op: 'delete',
          value: item,
        },
      });

      cy.wait(WEBSOCKETS_DELAY_TIME);
      // assert item is not in list
      cy.get(`[row-id = "${buildItemsTableRowId(item.id)}"]`).should(
        'not.exist',
      );
    });
  });
});
