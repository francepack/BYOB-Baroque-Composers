const express = require('express')
// brings in express package and sets it to variable
const environment = process.env.NODE_ENV || 'development';
// finds what environment we are in, uses development environment by default
const configuration = require('./knexfile')[environment];
// get configuration info for database for  whatever environment we are in
const database = require('knex')(configuration);
// connects express app to configuration

const app = express()
// app is assigned to our express app
const port = 3002
// can adjust which localhost server is used by changing the value of port
app.use(express.json())
// the app will parse json of the request body by default

app.listen(port, () => console.log(`App listening on port ${port}!`))
// app will listen for requests at the given port and return a message to the console to verify

// GET all composers
app.get('/api/v1/composers', (request, response) => {
// calls get method on app at url in the first parameter. gets all composers
  database('composers').select()
// tells which database to use and gives us that data
    .then((composers) => {
// when we get the data, do something to it. data is defined as composers
      response.status(200).json(composers);
// return a response with a 200 status and display parsed json of composer data
    })
    .catch((error) => {
// if an error occurs and we do not get composers back, the error will be caught
      response.status(500).json({ error });
// if an error is caught, a status of 500 and the parsed error will be sent back
    });
});


// GET all compositions
app.get('/api/v1/compositions', (request, response) => {
// calls get method on app at url in the first parameter. gets all compositions
  database('compositions').select()
// tells which database to use and gives us that data
    .then((compositions) => {
// when we get the data, do something to it. data is defined as choralWorks
      response.status(200).json(compositions);
// return a response with a 200 status and display parsed json of composition data
    })
    .catch((error) => {
// if an error occurs and we do not get compositions back, the error will be caught
      response.status(500).json({ error });
// if an error is caught, a status of 500 and the parsed error will be sent back
    });
});

// GET a particular composer
app.get('/api/v1/composers/:id', (request, response) => {
// calls get method on app at url in the first parameter. gets a composer at the input id
  database('composers').where('id', request.params.id).select()
// tells which database to look in, and where specifically- finds an id that matches the id in the request url
    .then(composer => {
// when we get the requested composer, do something to it. data is defined as composer
      if (composer.length) {
// here, we check to make sure what was returned has value
        response.status(200).json(composer[0]);
// if composer has something inside of it, return a status of 200 and display the parsed composer. I give back composer[0] (composer at index 0) as it initially comes back as a single object in an array
      } else {
// if composer has no length, meaning no data id matched the user input id
        response.status(404).json({
// send a response with status of 404...
          error: `Composer with id ${request.params.id} not found`
// and a custom message telling the user the id they used and that nothing was found for it
        });
      }
    })
    .catch(error => {
// if an error occurs and we do not get a composer back, the error will be caught
      response.status(500).json({ error });
// if an error is caught, a status of 500 and the parsed error will be sent back
    });
});

// GET a particular composition
app.get('/api/v1/compositions/:id', (request, response) => {
// calls get method on app at url in the first parameter. gets a composition at the input id
  database('compositions').where('id', request.params.id).select()
// tells which database to look in, and where specifically- finds an id that matches the id in the request url
    .then(composition => {
// when we get the requested composition, do something to it. data is defined as composition
      if (composition.length) {
// here, we check to make sure what was returned has value
        response.status(200).json(composition[0]);
// if composition has something inside of it, return a status of 200 and display the parsed composition. I give back composition[0] (composition at index 0) as it initially comes back as a single object in an array
      } else {
// if composition has no length, meaning no data id matched the user input id
        response.status(404).json({
// send a response with status of 404...
          error: `Composition with id ${request.params.id} not found`
// and a custom message telling the user the id they used and that nothing was found for it
        });
      }
    })
    .catch(error => {
// if an error occurs and we do not get a composition back, the error will be caught
      response.status(500).json({ error });
// if an error is caught, a status of 500 and the parsed error will be sent back
    });
});

// GET all compositions by a particular composer
app.get('/api/v1/composers/:id/compositions', (request, response) => {
// calls get method on app at url in the first parameter. gets all compositions of the composer at the input id
  database('compositions').where('composer_id', request.params.id).select()
// tells which database to look in, and where specifically- finds composer ids that match the id in the request url
    .then(compositions => {
// when we get the requested compositions, do something to it. data is defined as compositions
      if (compositions.length) {
// here, we check to make sure compositions were returned, meaning the array we get back actually has content
        response.status(200).json(compositions)
// if compositions has something inside of it, return a status of 200 and display the parsed compositions.
      } else {
// if compositions has no length, meaning no composer id matched the user input id
        response.status(404).json({
// send a response with status of 404...
          error: `Could not find compositions for composer with id ${request.params.id}`
// and a custom message telling the user the id they used and that nothing was found for it
        });
      }
    })
    .catch(error => {
// if an error occurs and we do not get compositions back, the error will be caught
      response.status(500).json({ error });
// if an error is caught, a status of 500 and the parsed error will be sent back
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
      response.status(201).json({ id: composer[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

// POST a composition
app.post('api/v1/composers/:id/compositions', (request, response) => {
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

// DELETE a composer

// Will deleting a composer get rid of their compositions?

// DELETE a composition