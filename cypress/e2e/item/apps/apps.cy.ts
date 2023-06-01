import { buildItemPath } from '../../../../src/config/paths';
import { APP_USING_CONTEXT_ITEM } from '../../../fixtures/apps';

describe('Apps', () => {
  it('App should request context', () => {
    const { id, name } = APP_USING_CONTEXT_ITEM;
    cy.setUpApi({ items: [APP_USING_CONTEXT_ITEM] });
    cy.visit(buildItemPath(id));

    cy.wait(3000);

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
