# Portal 🩺

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
    ghcr.io/kohlbacherlab/dnpm-dip-portal:latest
```

### Development 
To start the portal with the associated modules such as rd, mtb, etc, the following steps must be performed in sequence.

**`Prerequirements`**

- **Node.js** v.18+ must be installed on the host machine

**`Download`**

```shell
$ git clone https://github.com/KohlbacherLab/dnpm-dip-portal
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

