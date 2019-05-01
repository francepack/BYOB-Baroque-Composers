const express = require('express')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express()
const port = 3002
app.use(express.json())
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// GET all composers
app.get('/api/v1/composers', (request, response) => {
  database('composers').select()
    .then((composers) => {
      response.status(200).json(composers);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});


// GET all compositions
app.get('/api/v1/compositions', (request, response) => {
  database('compositions').select()
    .then((choralWorks) => {
      response.status(200).json(choralWorks);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// GET a particular composer
app.get('/api/v1/composers/:id', (request, response) => {
  database('composers').where('id', request.params.id).select()
    .then(composer => {
      if (composer.length) {
        response.status(200).json(composer);
      } else {
        response.status(404).json({
          error: `Composer with id ${request.params.id} not found`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// GET a particular composition
app.get('/api/v1/compositions/:id', (request, response) => {
  database('compositions').where('id', request.params.id).select()
    .then(composition => {
      if (composition.length) {
        response.status(200).json(composition);
      } else {
        response.status(404).json({
          error: `Composition with id ${request.params.id} not found`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// GET all compositions by a particular composer
app.get('/api/v1/composers/:id/compositions', (request, response) => {
  database('compositions').where('composer_id', request.params.id).select()
    .then(compositions => {
      if (compositions.length) {
        response.status(200).json(compositions)
      } else {
        response.status(404).json({
          error: `Could not find compositions for composer with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// POST a composer
app.post('api/v1/composers', (request, response) => {
  const composer = request.body;
    for (let requiredParameter of ['name', 'nationality', 'lifespan']) {
      if (!composer[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { name: <string>, nationality: <string>, lifespan: <string> }`});
      }
    }
    database('composers').insert(composer, 'id')
      .then(composer => {
        response.status(201).json(composer)
      })
      .catch(error => {
        response.status(500).json({ error })
      });
});

// POST a composition
// app.post('api/v1/compositions', (request, response) => {
//   const composition = request.body;
//     for (let requiredParameter of ['name', 'arrangedFor']) {
//       if(!composition[requiredParameter]) {
//         return response
//           .status(422)
//           .send({ error: `Expected format: { name: <string>, arrangedFor: <string>, composer_id: <string> }`});
//       }
//     }
//     database('compositions').insert(composition, 'id')
//       .then(composition =>  
//         response.status(201).json()  <===||
//       })
//       .catch(error => {
//         response.status(500).json({ error })
//       });
// });
// how would we give this a foreign id, associate with composer?

// DELETE a composer

// DELETE a composition