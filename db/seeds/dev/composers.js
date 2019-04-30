const composerData = require('../../composerData')

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
          work: work,
          composer_id: composerId[0]
        })
      )
    });

    return Promise.all(footnotePromises);
  })
};

const createChoralWork = (knex, work) => {
  return knex('choralWorks').insert(work);
};

exports.seed = (knex, Promise) => {
  return knex('choralWorks').del() // delete footnotes first
    .then(() => knex('composers').del()) // delete all papers
    .then(() => {
      let composerPromises = [];

      composerData.forEach(composer => {
        composerPromises.push(createComposer(knex, composer));
      });

      return Promise.all(composerPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};