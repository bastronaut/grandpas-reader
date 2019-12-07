const express = require('express');
const app = express();
var cors = require('cors');
const port = 3000;

app.use(cors());
app.use(require('./controllers'));

app.use(express.static('../frontend'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));