declare namespace Cypress {
  interface Chainable {
    // todo: improve types
    setUpApi(args: any): Chainable;
  }
}
