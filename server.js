const express = require('express')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express()
const port = 3002
app.use(express.json())

app.listen(port, () => console.log(`App listening on port ${port}!`))

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
    .then((compositions) => {
      response.status(200).json(compositions);
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
        response.status(200).json(composer[0]);
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
        response.status(200).json(composition[0]);
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
app.post('/api/v1/composers', (request, response) => {
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
      response.status(201).json({ id: composer[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

// POST a composition
app.post('/api/v1/composers/:id/compositions', (request, response) => {
  const composition = request.body;
  for (let requiredParameter of ['name', 'arrangedFor']) {
    if(!composition[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <string>, arrangedFor: <string>, composer_id: <string> }`});
    }
  }
  database('composers').where('id', request.params.id).select()
    .then(composer => {
      if (!composer) {
        return response
          .status(422)
          .json(`No composer at id ${request.params.id} was found. Please check id in url, or post composer before adding this composition`)
      }
    });
  database('compositions').insert({...composition, composer_id: request.params.id}, 'id')
    .then(composition => {
      response.status(201).json({ id: composition[0] }) 
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

// PUT existing composer
app.put('/api/v1/composers/:id', (request, response) => {
  const composer = request.body;
  for (let requiredParameter of ['name', 'nationality', 'lifespan']) {
    if (!composer[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <string>, nationality: <string>, lifespan: <string> }`});
    }
  }
  let found = false;
  database('composers').select()
    .then(composers => {
      composers.forEach(composer => {
        if (composer.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ error: `Composer at id ${request.params.id} was not found`});
      } else {
      database('composers').where('id', request.params.id).update({
        name: request.body.name,
        nationality: request.body.nationality,
        lifespan: request.body.lifespan
      })
      .then(composer => {
        response.status(202).json(`Replacement of id ${request.params.id} complete.`)
      })
    } 
  })
  .catch(error => {
    response.status(500).json({ error })
  });
});

// PUT existing composition
app.put('/api/v1/compositions/:id', (request, response) => {
  const composition = request.body;
  for (let requiredParameter of ['name', 'arrangedFor']) {
    if (!composition[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <string>, arrangedFor: <string> }`});
    }
  }
  let found = false;
  database('compositions').select()
    .then(compositions => {
      compositions.forEach(composition => {
        if (composition.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ error: `Composition at id ${request.params.id} was not found`});
      } else {
      database('compositions').where('id', request.params.id).update({
        name: request.body.name,
        arrangedFor: request.body.arrangedFor
      })
      .then(composition => {
        response.status(202).json(`Replacement of id ${request.params.id} complete.`)
      })
    } 
  })
  .catch(error => {
    response.status(500).json({ error })
  });
});

// DELETE a composer
app.delete('/api/v1/composers/:id', (request, response) => {
  let found = false;
  database('composers').select()
    .then(composers => {
      composers.forEach(composer => {
        if (composer.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ error: `Composer at id ${request.params.id} was not found`});
      } else {
        database('compositions').where('composer_id', request.params.id).del()
          .then(() => {
            database('composers').where('id', request.params.id).del()
              .then(() => {
                response.status(202)
                  .json(`Successful deletion of composer id ${request.params.id}`)
              })
          })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

// DELETE a composition
app.delete('/api/v1/compositions/:id', (request, response) => {
  let found = false;
  database('compositions').select()
    .then(compositions => {
      compositions.forEach(composition => {
        if (composition.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ error: `Composition at id ${request.params.id} was not found`});
      } else {
        database('compositions').where('id', request.params.id).del()
          .then(() => {
            response.status(202)
              .json(`Successful deletion of composition id ${request.params.id}`)
          })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});