const express = require('express');
// brings in express package and sets it to variable
const environment = process.env.NODE_ENV || 'development';
// finds what environment we are in, uses development environment by default
const configuration = require('./knexfile')[environment];
// get configuration info for database for  whatever environment we are in
const database = require('knex')(configuration);
// connects express app to configuration

const app = express();
// 'app' is assigned to our express app
app.set('port', process.env.PORT || 3000);
// port is assigned to 3000 by default, or what our environment finds available
app.use(express.json());
// the app will parse json of the request body by default

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}!`));
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
        response.status(200).json(compositions);
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
app.post('/api/v1/composers', (request, response) => {
// calls post method on app at url in the first parameter. user will provide a body which will be used to post a new composer to the database
  const composer = request.body;
// declare variable composer as the body of the request made by user making post request
  for (let requiredParameter of ['name', 'nationality', 'lifespan']) {
// using a for...of statement, we declare requiredParameters as an iteration over the strings in the array after 'of'. These strings are the keys we want to have truthy values in for a valid composer entry
    if (!composer[requiredParameter]) {
// as the iteration runs, we check to see if composer doesn't have, or doesn't have value in, any key of the strings we are iterating over
      return response.status(422).send({ 
// if any desired key is missing or doesn't have value, we return out with a response, sending status 422 and...
        error: `Expected format: { name: <string>, nationality: <string>, lifespan: <string> }`
// a custom error message, reminding user of needed keys and format of entry

      });
    }
  };
  database('composers').insert(composer, 'id')
// if the validation doesn't reach a return, we get here, going to database composers and inserting a composer as the users input and an id
    .then(composer => {
// after we insert the new composer, we are given back an array containing the added composer that we name composer
      response.status(201).json({ id: composer[0] });
// we send back a response with a status 201 and with a parsed object with a key id that has a value of the newly assigned id of the composer in the returned array (hence, we use index 0)
    })
    .catch(error => {
// if an error occurs during this server process, the error will be caught
      response.status(500).json({ error });
// sends response with status 500 and a parsed copy of the error object
    });
});

// POST a composition
app.post('/api/v1/composers/:id/compositions', (request, response) => {
// calls post method on app at url in the first parameter. user will provide a body which will be used to post a new composition to the database
  const composition = request.body;
// declare variable composition as the body of the request made by user making post request
  for (let requiredParameter of ['name', 'arrangedFor']) {
// using a for...of statement, we declare requiredParameters as an iteration over the strings in the array after 'of'. These strings are the keys we want to have truthy values in for a valid composition entry
    if(!composition[requiredParameter]) {
// as the iteration runs, we check to see if composer doesn't have, or doesn't have value in, any key of the strings we are iterating over
      return response.status(422).send({ 
// if any desired key is missing or doesn't have value, we return out with a response with a status 422 and...
        error: `Expected format: { name: <string>, arrangedFor: <string>, composer_id: <string> }`
// a custom error message, reminding user of needed keys and format of entry
      });
    }
  };
  database('composers').where('id', request.params.id).select()
// start a check to make sure there is a composer in the database that the poster includes in the post url. We look in database composers, and specifically for an id that matches the url id given, and select that
    .then(composer => {
// we call the returned composer
      if (!composer) {
// we check to make sure the return has value
        return response.status(422).json({
// if it doesn't, we return out and send a response to avoid adding a composition of a composer we do not have. response has status 422 and...
            error: `No composer at id ${request.params.id} was found. Please check id in url, or post composer before adding this composition`
// a custom error message describing what the problem may be
        });
      }
    });
  database('compositions').insert({...composition, composer_id: request.params.id}, 'id')
// if the validation doesn't reach a return, we get here, going to database compositions and inserting a composition as the users input, the composer_id that matches the verified id in the params, and an individual id
    .then(composition => {
// after we insert the new composition, we are given back an array containing the added composition that we name composition
      response.status(201).json({ id: composition[0] });
// we send back a response with a status 201 and with a parsed object with a key id that has a value of the newly assigned id of the composition in the returned array (hence, we use index 0)  
    })
    .catch(error => {
// if an error occurs during this server process, the error will be caught
      response.status(500).json({ error });
// sends response with status 500 and a parsed copy of the error object
    });
});

// PUT existing composer
app.put('/api/v1/composers/:id', (request, response) => {
  const composer = request.body;
  for (let requiredParameter of ['name', 'nationality', 'lifespan']) {
    if (!composer[requiredParameter]) {
      return response.status(422).send({ 
        error: `Expected format: { name: <string>, nationality: <string>, lifespan: <string> }`
      });
    }
  };
  let found = false;
  database('composers').select()
    .then(composers => {
      composers.forEach(composer => {
        if (composer.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ 
          error: `Composer at id ${request.params.id} was not found`
        });
      } else {
      database('composers').where('id', request.params.id).update({
        name: request.body.name,
        nationality: request.body.nationality,
        lifespan: request.body.lifespan
      })
      .then(composer => {
        response.status(202).json( 
          `Replacement of composer id ${request.params.id} complete.`
        );
      });
    } 
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// PUT existing composition
app.put('/api/v1/compositions/:id', (request, response) => {
  const composition = request.body;
  for (let requiredParameter of ['name', 'arrangedFor']) {
    if (!composition[requiredParameter]) {
      return response.status(422).send({ 
        error: `Expected format: { name: <string>, arrangedFor: <string> }`
      });
    }
  };
  let found = false;
  database('compositions').select()
    .then(compositions => {
      compositions.forEach(composition => {
        if (composition.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ 
          error: `Composition at id ${request.params.id} was not found`
        });
      } else {
      database('compositions').where('id', request.params.id).update({
        name: request.body.name,
        arrangedFor: request.body.arrangedFor
      })
      .then(composition => {
        response.status(202).json(
          `Replacement of composition id ${request.params.id} complete.`
        );
      });
    } 
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

// PATCH existing composer
app.patch('/api/v1/composers/:id', (request, response) => {
  let found = false;
  database('composers').select()
    .then(composers => {
      composers.forEach(composer => {
        if (composer.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ 
          error: `Composer at id ${request.params.id} was not found`
        });
      } else { 
        for (let parameter of ['name', 'nationality', 'lifespan']) {
          if (request.body[parameter]) {
            database('composers').where('id', request.params.id).update({[parameter]: request.body[parameter]})
              .then(composer => composer);
          }
        };
      }
    })
    .then(composer => {
      response.status(202).json(
        `Patch of composer id ${request.params.id} complete.`
      );
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// PATCH existing composition
app.patch('/api/v1/compositions/:id', (request, response) => {
  let found = false;
  database('compositions').select()
    .then(compositions => {
      compositions.forEach(composition => {
        if (composition.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ 
          error: `Composition at id ${request.params.id} was not found`
        });
      } else { 
        for (let parameter of ['name', 'arrangedFor']) {
          if (request.body[parameter]) {
            database('compositions').where('id', request.params.id).update({[parameter]: request.body[parameter]})
              .then(composition => composition);
          }
        };
      }
    })
    .then(composition => {
      response.status(202).json(
        `Patch of composition id ${request.params.id} complete.`
      );
    })
    .catch(error => {
      response.status(500).json({ error });
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
        return response.status(404).json({ 
          error: `Composer at id ${request.params.id} was not found`
        });
      } else {
        database('compositions').where('composer_id', request.params.id).del()
          .then(() => {
            database('composers').where('id', request.params.id).del()
              .then(() => {
                response.status(202).json(
                  `Successful deletion of composer id ${request.params.id}`
                );
              });
          });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
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
        return response.status(404).json({ 
          error: `Composition at id ${request.params.id} was not found`
        });
      } else {
        database('compositions').where('id', request.params.id).del()
          .then(() => {
            response.status(202).json(
              `Successful deletion of composition id ${request.params.id}`
            );
          });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});