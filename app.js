require('dotenv').config()
const express = require('express');
const app = express();
var cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(require('./controllers'));

app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));