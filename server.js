const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const ships = require('./src/api/ships.js');

const port = 5858;

app.listen(port, () => console.log(`listening on port ${port}!`));

app.use(bodyParser.json());

app.use('/api/ships', ships);
app.use('/scripts', express.static('node_modules'));
app.use('/', express.static('src/client'));