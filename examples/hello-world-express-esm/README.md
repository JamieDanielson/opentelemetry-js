# testing esm instrumentation

Steps:

- adjust `package.json` for each instrumentation library to use local code (and install and compile)
- follow steps for using app as CommonJS (install, build, start, curl)
- follow steps for using app as ESM (set to module, clean, build, start, curl)

## use local code for other packages:

adjust dependencies in other packages to ensure they're all using the same code from this PR (`npm install` and `npm run compile` afterward):

`experimental/packages/opentelemetry-sdk-node/package.json` and `experimental/packages/opentelemetry-instrumentation-http/package.json`:

```json
"@opentelemetry/instrumentation": "file:../opentelemetry-instrumentation",
```

in local clone of `opentelemetry-js-contrib/plugins/node/opentelemetry-instrumentation-express/package.json` :

```json
"@opentelemetry/instrumentation": "file:../../../../opentelemetry-js/experimental/packages/opentelemetry-instrumentation",
```

## use app as CommonJS:

`npm install`

`npm run build`

`npm start`

`curl localhost:3000`

see 5 total spans: 1 http, 3 express, 1 manual

## use app as ESModules:

`npm install`

in `tsconfig.json`, change `"module": "CommonJS"` to `"module": "ESNext"`

In `package.json`, change `"type": "commonjs",` to `"type": "module",`

`npm run clean`

`npm run build`

`npm run start-esm`

`curl localhost:3000`

see 1 total span: 1 manual
