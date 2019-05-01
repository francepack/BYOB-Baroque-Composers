const express = require('express')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express()
const port = 3002
app.use(express.json())
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/api/v1/composers', (request, response) => {
  database('composers').select()
    .then((composers) => {
      response.status(200).json(composers);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/compositions', (request, response) => {
  database('compositions').select()
    .then((choralWorks) => {
      response.status(200).json(choralWorks);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});