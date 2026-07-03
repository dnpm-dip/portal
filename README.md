# Portal 🩺

[![main](https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg)](https://github.com/dnpm-dip/portal/actions/workflows/main.yml)
[![CodeQL](https://github.com/dnpm-dip/portal/actions/workflows/codeql.yml/badge.svg)](https://github.com/dnpm-dip/portal/actions/workflows/codeql.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/dnpm-dip/portal/badge.svg)](https://snyk.io/test/github/dnpm-dip/portal)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This repository contains the Portal of DNPM:DIP.

**Table of Contents**

- [Packages](#packages)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)


## Packages

The repository contains the following packages:

- **@dnpm-dip/core**: This package contains common constants, functions, types, ...
- **@dnpm-dip/kit**: This package contains utilities to register dnpm dip modules to the portal.
- **@dnpm-dip/portal**: This package contains the User Interface (UI).
- **@dnpm-dip/admin**: This package contains the admin module.
- **@dnpm-dip/rd**: This package contains the module for Rare Diseases (RD).
- **@dnpm-dip/mtb**: This package contains the module for Molecular Tumor Boards (MTBs).

## Usage

### Production

**`Prerequirements`**

- **Docker** v.24+ must be installed on the host machine

**`Run`**

```shell
$ docker run -d -p 3000:3000 \
    --restart=always \
    ghcr.io/dnpm-dip/portal:latest
```

### Configuration

The portal is configured at runtime via environment variables (pass them with `docker run -e ...`):

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_PUBLIC_API_URL` | `https://dnpm-dip.net/api/` | REST API base URL |
| `NUXT_PUBLIC_AUTHUP_URL` | `https://dnpm-dip.net/auth/` | Authup base URL |
| `NUXT_PUBLIC_AUTHUP_CLIENT_ID` | `web` | OAuth2 client used for the login (authorization-code) flow |
| `NUXT_PUBLIC_COOKIE_DOMAIN` | — | Cookie domain for the auth session |

#### Authentication

The portal signs in with the **OAuth2 Authorization Code flow (PKCE)** — credentials are
never entered in the portal UI. On the login page the user picks a **realm** (`ARealmGrid`,
which reveals a search field once more than 8 realms exist); the portal then builds an
authorize URL and redirects to Authup's `/authorize` endpoint, where the login form and the
configured identity providers live. Authup redirects back to `<portal-origin>/login/callback`,
and the `@authup/client-web-nuxt` routing interceptor exchanges the authorization code for a
session.

The OAuth client is configurable via `NUXT_PUBLIC_AUTHUP_CLIENT_ID` (default: `web`, the
Authup built-in web client). The configured client **must** register
`<portal-origin>/login/callback` as an allowed redirect URI, or Authup rejects the redirect.

### Development 
To start the portal with the associated modules such as rd, mtb, etc, the following steps must be performed in sequence.

**`Prerequirements`**

- **Node.js** v.18+ must be installed on the host machine

**`Download`**

```shell
$ git clone https://github.com/dnpm-dip/portal
$ cd dnpm-dip-portal
```

**`Installation`** 

The following step installs all dependencies and dev dependencies necessary for the execution and development of the ecosystem.

```shell
$ npm i
```

**`Build`**

The following step creates an initial build of all packages.

```shell
$ npm run build
```

**`Run`**

The following step is necessary to start the portal in development mode 
and the related features like hot module replacement (HMR).

```shell
$ npm run dev --workspace=packages/portal
```

## Credits

If you have any questions, feel free to contact the author & creator Peter Placzek of the project.
The project is being developed as part of the author's master's thesis.

## License

Made with 💚

Published under [MIT License](./LICENSE).

