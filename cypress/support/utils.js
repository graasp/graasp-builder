import Papa from 'papaparse';

import { EXPORT_CSV_HEADERS } from '../../src/config/constants';

// use simple id format for tests
export const ID_FORMAT = '(?=.*[0-9])(?=.*[a-zA-Z])([a-z0-9-]+)';

/**
 * Parse characters of a given string to return a correct regex string
 * This function mainly allows for endpoints to have fixed chain of strings
 * as well as regex descriptions for data validation, eg /items/item-login?parentId=<id>
 *
 * @param {string} string
 * @param {string[]} characters
 * @param {boolean} parseQueryString
 * @returns regex string of the given string
 */
export const parseStringToRegExp = (
  string,
  { characters = ['?', '.'], parseQueryString = false } = {},
) => {
  const [originalPathname, ...queryStrings] = string.split('?');
  let pathname = originalPathname;
  let querystring = queryStrings.join('?');
  characters.forEach((c) => {
    pathname = pathname.replaceAll(c, `\\${c}`);
  });
  if (parseQueryString) {
    characters.forEach((c) => {
      querystring = querystring.replaceAll(c, `\\${c}`);
    });
  }
  return `${pathname}${querystring.length ? '\\?' : ''}${querystring}`;
};

export const EMAIL_FORMAT = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+';

const validateCsvData = (data, numMessages) => {
  expect(data).to.have.length(numMessages);
};

const validateHeaders = (headers) => {
  const expectedHeader = EXPORT_CSV_HEADERS.map((h) => h.label);
  expect(headers).to.deep.equal(expectedHeader);
};

export const verifyDownloadedChat = (name, numMessages) => {
  // get file from download folder
  const downloadsFolder = Cypress.config('downloadsFolder');
  const filename = [downloadsFolder, name].join('/');
  cy.readFile(filename, 'utf-8').then((csvString) => {
    // parse CSV data with headers
    const { data, meta } = Papa.parse(csvString, { header: true });
    validateHeaders(meta.fields);
    validateCsvData(data, numMessages);
  });
};
