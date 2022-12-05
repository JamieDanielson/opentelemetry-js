# testing esm instrumentation

Steps:

- install lerna and run npm run bootstrap to symlink dependencies for local code
- follow steps for using app as CommonJS (clean, build, start, curl)
- follow steps for using app as ESM (set to module, clean, build, start, curl... `npm run doit`)

## use local code for other packages:

install lerna and run npm run bootstrap to symlink dependencies for local code

note: do not run `npm install` after this - notice the node_modules are symlinked

note: adding express instrumentation from contrib doesn't seem to work well with this lerna bootstrap (likely just dependency conflicts)

## use app as CommonJS:

`npm run clean`

`npm run build`

`npm start`

`curl localhost:3000`

see 2 total spans: 1 http, 1 manual

## use app as ESModules:

in `tsconfig.json`, change `"module": "CommonJS"` to `"module": "ESNext"`

In `package.json`, change `"type": "commonjs",` to `"type": "module",`

run `npm run doit` to clean, build, and start with the experimental loader.

the `npm run doit` script runs:

```sh
npm run clean
npm run build
npm run start-esm
```

`curl localhost:3000`

see 1 total span: 1 manual
