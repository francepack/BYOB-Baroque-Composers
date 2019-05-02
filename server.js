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
// calls post method on app at url in the first parameter. user will provide a body which will be used to post a new composer to the database
  const composer = request.body;
// declare variable composer as the body of the request made by user making post request
  for (let requiredParameter of ['name', 'nationality', 'lifespan']) {
// using a for...of statement, we declare requiredParameters as an iteration over the strings in the array after 'of'. These strings are the keys we want to have truthy values in for a valid composer entry
    if (!composer[requiredParameter]) {
// as the iteration runs, we check to see if composer doesn't have, or doesn't have value in, any key of the strings we are iterating over
      return response
// if any desired key is missing or doesn't have value, we return out with a response
        .status(422)
// respose has status 422...
        .send({ error: `Expected format: { name: <string>, nationality: <string>, lifespan: <string> }`});
// and sends an error with custom message, reminding user of needed keys and format of entry
    }
  }
  database('composers').insert(composer, 'id')
// if the validation doesn't reach a return, we get here, going to database composers and inserting a composer as the users input and an id
    .then(composer => {
// after we insert the new composer, we are given back an array containing the added composer that we name composer
      response.status(201).json({ id: composer[0] })
// we send back a response with a status 201 and with a parsed object with a key id that has a value of the newly assigned id of the composer in the returned array (hence, we use index 0)
    })
    .catch(error => {
// if an error occurs during this server process, the error will be caught
      response.status(500).json({ error })
// sends response with status 500 and a parsed copy of the error object
    });
});

// POST a composition
app.post('api/v1/composers/:id/compositions', (request, response) => {
// calls post method on app at url in the first parameter. user will provide a body which will be used to post a new composition to the database
  const composition = request.body;
// declare variable composition as the body of the request made by user making post request
  for (let requiredParameter of ['name', 'arrangedFor']) {
// using a for...of statement, we declare requiredParameters as an iteration over the strings in the array after 'of'. These strings are the keys we want to have truthy values in for a valid composition entry
    if(!composition[requiredParameter]) {
// as the iteration runs, we check to see if composer doesn't have, or doesn't have value in, any key of the strings we are iterating over
      return response
// if any desired key is missing or doesn't have value, we return out with a response
        .status(422)
// respose has status 422...
        .send({ error: `Expected format: { name: <string>, arrangedFor: <string>, composer_id: <string> }`});
// and sends an error with custom message, reminding user of needed keys and format of entry
    }
  }
  database('composers').where('id', request.params.id).select()
// start a check to make sure there is a composer in the database that the poster includes in the post url. We look in database composers, and specifically for an id that matches the url id given, and select that
    .then(composer => {
// we call the return composer
      if (!composer) {
// we check to make sure the return has value
        return response
// if it doesn't, we return out and send a response to avoid adding a composition of a composer we do not have
          .status(422)
// response has status 422, meaning the type of data sent was recognized, but it couldn't be procesed...
          .json(`No composer at id ${request.params.id} was found. Please check id in url, or post composer before adding this composition`)
// and send a message explaining why the composition could not be added
      }
    });
  database('compositions').insert({...composition, composer_id: request.params.id}, 'id')
// if the validation doesn't reach a return, we get here, going to database compositions and inserting a composition as the users input, the composer_id that matches the verified id in the params, and an individual id
    .then(composition => {
// after we insert the new composition, we are given back an array containing the added composition that we name composition
      response.status(201).json({ id: composition[0] }) 
// we send back a response with a status 201 and with a parsed object with a key id that has a value of the newly assigned id of the composition in the returned array (hence, we use index 0) 
    })
    .catch(error => {
// if an error occurs during this server process, the error will be caught
      response.status(500).json({ error })
// sends response with status 500 and a parsed copy of the error object
    });
});

// DELETE a composer
app.delete('/api/v1/composers/:id', (request, response) => {
// calls delete method on app at url in the first parameter. deletes a composer at the given id in url
  let found = false;
// declare variable to serve as trigger to track if composer at given id was found 
  database('composers').select()
// look to dataset composer and get that data
    .then(composers => {
// after we get the data, name it composers and...
      composers.forEach(composer => {
// for each composer 
        if (composer.id === parseInt(request.param.id)) {
// check to see if the id matches the id in the url
          found = true;
// if a match is found, assign variable 'found' to true
        }
      });
      if(!found) {
// if variable 'found' is falsey
        return response.status(404).json({ error: `Composer at id ${request.params.id} was not found`});
// return out of this method and send a response with status 404 and a parsed error message
      } else {
// if a match is found
        database('compositions').where('composer_id', request.params.id).del()
// look into database compositions, find the compositions where the composer_id matches the request id, and delete any that match. If a composer is deleted, their compositions are also removed
          .then(() => {
// after that, we trigger a response with a callback as DELETE does not have a return
            database('composers').where('id', request.params.id).del()
// look into database composers, find the composer with an id that matches the request id, then delete it
              .then(() => {
// after that, we trigger a response with a callback as DELETE does not have a return
                response.status(202)
// send response with a status 202
                  .json(`Successful delete of composer id ${request.params.id}`)
// send a message letting informing of the successful delete
              })
          })
      }
    })
    .catch(error => {
// if an error occurs during this server process, the error will be caught
      response.status(500).json({ error })
// sends response with status 500 and a parsed copy of the error object
    });
});

// DELETE a composition
app.delete('/api/v1/compositions/:id', (request, response) => {
// calls delete method on app at url in the first parameter. deletes a composition at the given id in url
  let found = false;
// declare variable to serve as trigger to track if composition at given id was found 
  database('compositions').select()
// look to dataset composition and get that data
    .then(compositions => {
// after we get the data, name it composers and...
      compositions.forEach(composition => {
// for each composition
        if (composition.id === parseInt(request.param.id)) {
// check to see if the id matches the id in the url
          found = true;
// if a match is found, assign variable 'found' to true
        }
      });
      if(!found) {
// if variable 'found' is falsey
        return response.status(404).json({ error: `Composition at id ${request.params.id} was not found`});
// return out of this method and send a response with status 404 and a parsed error message
      } else {
        database('composition').where('id', request.params.id).del()
// look into database composers, find the composer with an id that matches the request id, then delete it
          .then(() => {
// after that, we trigger a response with a callback as DELETE does not have a return
            response.status(202)
// send response with a status 202
              .json(`Successful delete of composition id ${request.params.id}`)
// send a message letting informing of the successful delete

          })
      }
    })
    .catch(error => {
// if an error occurs during this server process, the error will be caught
      response.status(500).json({ error })
// sends response with status 500 and a parsed copy of the error object
    });
});