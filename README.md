# Graasp Builder

[![GitHub Release](https://img.shields.io/github/release/graasp/graasp-builder)]()
![Cypress CI](https://github.com/graasp/graasp-builder/actions/workflows/ci.yml/badge.svg?branch=main)
![typescript version](https://img.shields.io/github/package-json/dependency-version/graasp/graasp-builder/dev/typescript)
[![gitlocalized ](https://gitlocalize.com/repo/8885/whole_project/badge.svg)](https://gitlocalize.com/repo/8885/whole_project?utm_source=badge)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Installation

1. Run `yarn` to install the dependencies.
2. Run the API at `localhost:3000`
3. Set the following environnement variables in `.env.development`

```sh
VITE_PORT=3111
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_SHOW_NOTIFICATIONS=true
VITE_GRAASP_AUTH_HOST=http://localhost:3001
VITE_H5P_INTEGRATION_URL=
VITE_VERSION=latest-dev
```

4. Run `yarn start`. The client should be accessible at `localhost:3111`

### Authentication

The first requirement for fully accessing the client is to be authenticated. If not, the client will redirect to the authentication page. You have two possibilities to authenticate:

1. Set up and run the [`graasp-auth`](https://github.com/graasp/graasp-auth) repository. You may need to adapt your configuration to match the hosts.
2. Use [Postman](https://www.postman.com/) or anything similar to authenticate. Send to the API either
   - `POST <API_HOST>/register` with `name` and `email` or
   - `POST <API_HOST>/login` with your registered `email`.
     Once authenticated, you should receive a link to receive your cookie. Refer to the [API](https://github.com/graasp/graasp) for more details.

You are successfully authenticated if you can access to the client without being redirected.

## Testing

The tests are run using Cypress. Cypress only compiles the code for the tests, your app needs to run at the specified `baseUrl` in the cypress config.

### Running tests in interactive mode

Set the following environnement variables in `.env.test`

```sh
VITE_PORT=3333
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_GRAASP_AUTH_HOST=http://localhost:3001
VITE_GRAASP_PLAYER_HOST=http://localhost:3112
VITE_GRAASP_LIBRARY_HOST=http://localhost:3005
VITE_GRAASP_ANALYZER_HOST=http://localhost:3113
VITE_H5P_INTEGRATION_URL=
VITE_VERSION=cypress-tests
VITE_SHOW_NOTIFICATIONS=true
```

Run `yarn start:test` and `yarn cypress:open` in 2 terminal windows.

:warning: It is possible that the websocket test become flacks (or just stop passing) if you use the dev server. In that case, you can resort to first building the app in test mode `yarn build:test` and then starting a preview of the app with `yarn preview:test`.

### Running all tests in headless mode

You will need to have the `.env.test` file from the other section.

You can simply run: `yarn test`. This will:

1. Build your app in test mode (using the `.env.test` file to pull env variables)
2. Start your app in preview mode (simply serve the generated files with a static http server, but using the same `.env.test` file)
3. Start the cypress tests to run your full test suite (this can take a while depending on the number of tests you have)

## Developing

While developing you can run `yarn check` to perform prettier formatting checks, type checks and eslint rule checking.

## Translations

You can translate Graasp Builder through [GitLocalize](https://gitlocalize.com/repo/8885). Let us know if your language is not available.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/kim-lan-phan-hoang-a457bb130"><img src="https://avatars.githubusercontent.com/u/11229627?v=4?s=100" width="100px;" alt="Kim Lan Phan Hoang"/><br /><sub><b>Kim Lan Phan Hoang</b></sub></a><br /><a href="https://github.com/graasp/graasp-builder/commits?author=pyphilia" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/chau-alexandre/"><img src="https://avatars.githubusercontent.com/u/14943421?v=4?s=100" width="100px;" alt="Alexandre Chau"/><br /><sub><b>Alexandre Chau</b></sub></a><br /><a href="https://github.com/graasp/graasp-builder/commits?author=dialexo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/spaenleh"><img src="https://avatars.githubusercontent.com/u/39373170?v=4?s=100" width="100px;" alt="Basile Spaenlehauer"/><br /><sub><b>Basile Spaenlehauer</b></sub></a><br /><a href="https://github.com/graasp/graasp-builder/commits?author=spaenleh" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
