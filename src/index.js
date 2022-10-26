const express = require('express');
const app = express()
const routs = require('./routs')
const PORT = 3333

app.use(express.json())
app.use(routs)

app.listen(PORT, () => console.log('Listening on PORT 3333 ✨'))

