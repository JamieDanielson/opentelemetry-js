const { startNodeSDK } = require('../../experimental/packages/opentelemetry-sdk-node/build/src');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

startNodeSDK({ instrumentations: [getNodeAutoInstrumentations()] });

// Start the Express app
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  console.log('Received request to /');
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log('Visit http://localhost:3000/')
})
