# graasp-compose

## How to use the api

- add following hosts using `sudo vim /etc/hosts` with
  - `127.0.01 web.graasp.org`
  - `128.178.242.202 api.graasp.org`
- add in your `.env.local` file

```
REACT_APP_API_HOST=http://api.graasp.org:3111
PORT=3111
HOST=web.graasp.org
```
