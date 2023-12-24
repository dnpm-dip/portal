# Portal 💊

**Table of Contents**

- [Usage](#usage)
- [Credits](#credits)
- [License](#license)


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

