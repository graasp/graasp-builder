# Graasp Builder
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Installation

1. Run `yarn` to install the dependencies.
2. Run the API at `localhost:3000`
3. Set the following environnement variables in `.env.local`

```
REACT_APP_API_HOST=http://localhost:3000
PORT=3111
REACT_APP_SHOW_NOTIFICATIONS=true
REACT_APP_AUTHENTICATION_HOST=http://localhost:3001
REACT_APP_H5P_INTEGRATION_URL=
REACT_APP_VERSION=latest
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

Set the following environnement variables in `.env.test`

```
REACT_APP_API_HOST=http://localhost:3000
PORT=3111
REACT_APP_SHOW_NOTIFICATIONS=false
REACT_APP_NODE_ENV=test
REACT_APP_H5P_INTEGRATION_URL=
REACT_APP_VERSION=latest
```

Run `yarn cypress`. This should run every tests headlessly.
You can run `yarn cypress:open` to access the framework and visually display the tests' processes.

## Developing

While developing you can run `yarn check` to perform prettier formatting checks, type checks and eslint rule checking.

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
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
