// load type definitions that come with Cypress module
/// <reference types="cypress" />

export { };

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      // todo: improve types
      setUpApi(args: any): Chainable<Element>
    }
  }
}
