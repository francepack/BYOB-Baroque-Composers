const composerData = require('../../composerData.js');

const createComposer = (knex, composer) => {
  return knex('composers').insert({
    name: composer.name,
    nationality: composer.nationality,
    lifespan: composer.lifespan
  }, 'id')
  .then(composerId => {
    let choralWorkPromises = [];

    composer.choralWorks.forEach(work => {
      choralWorkPromises.push(
        createChoralWork(knex, {
          name: work.name,
          arrangedFor: work.arrangedFor,
          composers_id: composerId[0]
        })
      )
    });
    return Promise.all(choralWorkPromises);
  })
};

const createChoralWork = (knex, work) => {
  return knex('compositions').insert(work);
};

exports.seed = (knex, Promise) => {
  return knex('compositions').del()
    .then(() => knex('composers').del()) 
    .then(() => {
      let composerPromises = [];

      composerData.forEach(composer => {
        composerPromises.push(createComposer(knex, composer));
      });

      return Promise.all(composerPromises);
    })
    .then(() => console.log('seeding complete'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};