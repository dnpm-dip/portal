<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/admin</h1>

<p align="center">
    <b>Admin module for the DNPM:DIP Portal.</b><br>
    Manage Authup users, roles, clients and identity providers from inside the portal,<br>
    and see at a glance which peer sites this node can reach.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/admin"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fadmin%2Fpackage.json&label=version" alt="version" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
    <a href="#what-it-adds"><b>What it adds</b></a>
    ·
    <a href="#routes">Routes</a>
    ·
    <a href="#permissions">Permissions</a>
    ·
    <a href="#api-client">API client</a>
    ·
    <a href="#development">Development</a>
</p>

---

This package is private: it is not published to npm and ships inside the portal's Docker image. The portal loads
it from source (`'../admin/src/module'` in `packages/portal/nuxt.config.ts`).

## What it adds

<p align="center">
    <img src="./assets/connection-report.svg" alt="The admin module adds /admin with five menu entries: Overview needs no permission, but its connection report is only shown with connection_report_read; Identitätsanbieter, Benutzer, Rollen and Clients need the matching Authup identity_provider, user, role and client permissions. The overview fetches GET admin/connection-report and shows a ConnectionReport: the local site as self and each peer site with its status online or offline." width="100%" />
</p>

- **Overview** with the **connection report**: the local site and every peer site of the DNPM:DIP network, each
  with its status (`online` or `offline`) and details, as reported by the backend.
- **Authup administration**: users, roles, clients and identity providers, with their permission and role
  assignments. The forms and lists are `@authup/client-web-kit` components, so they talk to Authup directly
  through the signed-in user's session.

The module has the same shape as the use-case modules: `registerPages` from [`@dnpm-dip/nuxt-kit`](../nuxt-kit),
a plugin that provides the API client, and a plugin that registers the menu under **Admin**.

## Routes

| Route | Page |
|---|---|
| `/admin` | Overview and connection report |
| `/admin/users`, `/admin/users/add`, `/admin/users/:id()` | Users; a user's `permissions` and `roles` |
| `/admin/roles`, `/admin/roles/add`, `/admin/roles/:id()` | Roles; a role's `permissions` and `users` |
| `/admin/clients`, `/admin/clients/add`, `/admin/clients/:id()` | Clients; a client's `permissions`, `roles`, `scopes` and `url` |
| `/admin/identity-providers`, `…/add`, `…/:id()` | Identity providers; an identity provider's `roles` |

## Permissions

| Menu entry | Needs |
|---|---|
| Overview | Nothing; the connection report on it needs `connection_report_read` |
| Identitätsanbieter | `identity_provider_create`, `…_update`, `…_delete` or `…_read` |
| Benutzer | Authup `user_*` permissions |
| Rollen | Authup `role_*` and `role_permission_*` permissions |
| Clients | Authup `client_*` permissions |

The pages check the same permissions again in their route meta, for example `/admin/users` requires
`user_update`, `user_create`, `user_delete` or `user_read`. The menu requires a signed-in user.

Removing a role or permission assignment asks for confirmation through `@authup/client-web-kit`'s alert dialog.
The dialog host (`<VCAlertDialogProvider>`) is mounted by the portal's default layout; a layout without it makes
those buttons do nothing.

## API client

`AdminHTTPClient` wraps the portal's base `HTTPClient` and is provided under `Symbol.for('AdminHTTPClient')`:

| Method | Path below `API_URL` | Resolves |
|---|---|---|
| `getConnectionReport()` | `GET admin/connection-report` | `{ self: ConnectionPeer, peers: ConnectionPeer[], createdAt }` |

`ConnectionPeer` (from [`@dnpm-dip/http-kit`](../http-kit)) is `{ site: Coding, status: 'online' | 'offline',
details: string }`. Users, roles and the rest go to Authup, not to this client.

## Development

```bash
npm run test --workspace=packages/admin
npm run build --workspace=packages/admin
```

- **The tests are the real check, not the build.** `nuxt-module-build` transpiles each file on its own and exits
  `0` even when an import points at a module that no longer exists.
- Specs import `@dnpm-dip/*` from the sibling `src/` folders and need `.nuxt/tsconfig.json`: run
  `npx nuxt-module-build prepare` in this package once on a fresh checkout.
- `test/utils` has `createModuleClient(handlers)` and `mountModuleComponent(component, props, handlers)`.

## License

Published under [MIT License](../../LICENSE).
