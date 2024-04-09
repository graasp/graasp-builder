import { ItemType, PackedAppItemFactory } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import { buildAppItemLinkForTest } from '../../../fixtures/apps';

const APP = PackedAppItemFactory({
  extra: {
    [ItemType.APP]: {
      url: `${Cypress.env('VITE_GRAASP_API_HOST')}/${buildAppItemLinkForTest('app.html')}`,
    },
  },
});

describe('Apps', () => {
  it('App should request context', () => {
    const { id, name } = APP;
    cy.setUpApi({ items: [APP] });
    cy.visit(buildItemPath(id));

    cy.wait(2000);

    const iframeSelector = `iframe[title="${name}"]`;

    // check app receives successfully the context
    cy.clickElementInIframe(iframeSelector, '#requestContext');
    cy.checkContentInElementInIframe(
      iframeSelector,
      '#requestContext-message',
      id,
    );

    // check app receives successfully the token
    cy.clickElementInIframe(iframeSelector, '#requestToken');
    cy.checkContentInElementInIframe(
      iframeSelector,
      'ul',
      `GET_AUTH_TOKEN_SUCCESS_${id}`,
    );

    // check app can get app-data
    cy.clickElementInIframe(iframeSelector, '#createAppData');
    cy.checkContentInElementInIframe(iframeSelector, 'ul', 'get app data');
    // check app can post app-data
    cy.clickElementInIframe(iframeSelector, '#postAppData');
    cy.checkContentInElementInIframe(iframeSelector, 'ul', 'post app data');
    // check app can delete app-data
    cy.clickElementInIframe(iframeSelector, '#deleteAppData');
    cy.checkContentInElementInIframe(iframeSelector, 'ul', 'delete app data');
    // check app can patch app-data
    cy.clickElementInIframe(iframeSelector, '#patchAppData');
    cy.checkContentInElementInIframe(iframeSelector, 'ul', 'patch app data');
  });
});
