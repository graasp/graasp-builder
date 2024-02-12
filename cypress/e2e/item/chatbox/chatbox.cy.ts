import { MockWebSocket } from '@graasp/query-client';

import { v4 } from 'uuid';

import { buildItemPath } from '../../../../src/config/paths';
import {
  CHATBOX_ID,
  CHATBOX_INPUT_BOX_ID,
  ITEM_CHATBOX_BUTTON_ID,
} from '../../../../src/config/selectors';
import {
  ITEM_WITHOUT_CHATBOX_MESSAGES,
  ITEM_WITH_CHATBOX_MESSAGES,
} from '../../../fixtures/chatbox';
import { CURRENT_USER, MEMBERS } from '../../../fixtures/members';
import { CHATBOX_LOADING_TIME } from '../../../support/constants';

const openChatbox = () => {
  cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).click();
  cy.wait('@getItemChat', { timeout: CHATBOX_LOADING_TIME });
};

describe('Chatbox Scenarios', () => {
  let client: MockWebSocket;

  beforeEach(() => {
    client = new MockWebSocket();
  });

  it('Send messages in chatbox', () => {
    const item = ITEM_WITH_CHATBOX_MESSAGES;
    cy.visitAndMockWs(buildItemPath(item.id), { items: [item] }, client);

    // open chatbox
    openChatbox();
    // check the chatbox displays the already saved messages
    for (const msg of item.chat) {
      cy.get(`#${CHATBOX_ID}`).should('contain', msg.body);
    }

    // send message
    const message = 'a new message';
    const messageId = v4();
    // get the input field (which is a textarea because it is multiline
    cy.get(`#${CHATBOX_ID} #${CHATBOX_INPUT_BOX_ID} textarea:visible`).type(
      message,
    );
    cy.get(`#${CHATBOX_ID} #${CHATBOX_INPUT_BOX_ID} button`).click();
    cy.wait('@postItemChatMessage').then(({ request: { body } }) => {
      expect(body.body).to.equal(message);
      expect(body.mentions).to.deep.equal([]);

      // mock websocket response
      client.receive({
        realm: 'notif',
        type: 'update',
        topic: 'chat/item',
        channel: item.id,
        body: {
          kind: 'item',
          op: 'publish',
          message: {
            id: messageId,
            creator: CURRENT_USER.id,
            chatId: item.id,
            body: message,
            createdAt: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
        },
      });

      // check the new message is visible
      cy.get(`#${CHATBOX_ID} [data-cy=message-${messageId}]`).should(
        'contain',
        message,
      );
    });
  });

  it('Receive messages in chatbox from websockets', () => {
    const item = ITEM_WITHOUT_CHATBOX_MESSAGES;
    cy.visitAndMockWs(buildItemPath(item.id), { items: [item] }, client);

    openChatbox();

    const messageId = v4();
    // check websocket: the chatbox displays someone else's message
    const bobMessage = 'a message from bob';
    cy.get(`#${CHATBOX_ID}`).then(() => {
      client.receive({
        realm: 'notif',
        type: 'update',
        topic: 'chat/item',
        channel: item.id,
        body: {
          kind: 'item',
          op: 'publish',
          message: {
            id: messageId,
            creator: MEMBERS.BOB.id,
            chatId: item.id,
            body: bobMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });

      // check the new message is visible
      cy.get(`#${CHATBOX_ID} [data-cy=message-${messageId}]`).should(
        'contain',
        bobMessage,
      );
    });
  });
});
