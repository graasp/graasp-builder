# Graasp Compose

## Installation

1. Run `yarn` to install the dependencies
2. Run the API at `localhost:3000`
3. Set the following environnement variables in `.env.local`

```
REACT_APP_API_HOST=http://localhost:3000
PORT=3111
REACT_APP_UPLOAD_METHOD=default
REACT_APP_S3_FILES_HOST=
REACT_APP_SHOW_NOTIFICATIONS=true
REACT_APP_AUTHENTICATION_HOST=http://localhost:3001
```

4. Run `yarn start`. The client should be accessible at `localhost:3111`

### Authentication

The first requirement for fully accessing the client is to be authenticated. If not, the client will redirect to the authentication page. You have two possibilities to authenticate:

1. Set up and run the [`graasp-auth`](https://github.com/graasp/graasp-auth) repository. You may need to adapt your configuration to match the hosts.
2. Use [Postman](https://www.postman.com/) or anything similar to authenticate. Send to the API either
   - `GET <API_HOST>/register` with `name` and `email` or
   - `GET <API_HOST>/login` with your registered `email`.
     Once authenticated, you should receive a link to receive your cookie. Refer to the [API](https://github.com/graasp/graasp) for more details.

You are successfully authenticated if you can access to the client without being redirected.

### Environment Variables

- `REACT_APP_UPLOAD_METHOD` (default: `default`): This variable can take the following values: `default` or `s3`. `default` will save your file locally while `s3` will send the files to an S3 bucket configured with the `REACT_APP_S3_FILES_HOST` variable.

## Testing

Set the following environnement variables in `.env.test`

```
REACT_APP_API_HOST=http://localhost:3000
PORT=3111
REACT_APP_UPLOAD_METHOD=default
REACT_APP_S3_FILES_HOST=
REACT_APP_SHOW_NOTIFICATIONS=false
REACT_APP_NODE_ENV=test
```

Run `yarn cypress`. This should run every tests headlessly.
You can run `yarn cypress:open` to access the framework and visually display the tests' processes.
