const express = require('express');
const app = express();
var cors = require('cors');
const port = 3000;

app.use(cors());
app.use(require('./controllers'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));