export const expectNumberOfShortLinks = (expectedNumber: number): void => {
  cy.wait('@getShortLinksItem').then(({ response: { body } }) => {
    expect(Object.keys(body).length).equals(expectedNumber);
  });
};

export const expectShortLinksEquals = (expectedAlias: string[]): void => {
  cy.wait('@getShortLinksItem').then(({ response: { body } }) => {
    expectedAlias.forEach((a) => expect(Object.values(body)).includes(a));
  });
};
