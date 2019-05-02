# BaroqueChoralComposers
Every choir student should sing something from the Baroque time period. The embellished, complex vocal lines are great learning experiences for any singer. This API holds information about Baroque choral composers and their compositions. Users may add composers and compositions as well. This is build with Knex and Node.js/Express, using PostgreSQL for a database.

## Deployment

## API Calls
### Get
#### GET '/api/v1/composers'
Get all composers
**Example Response**
```
[
  {
    "id": 21,
    "name": "Johann Sebastian Bach",
    "nationality": "German",
    "lifespan": "1685-1750",
    "created_at": "2019-05-01T01:28:48.218Z",
    "updated_at": "2019-05-01T01:28:48.218Z"
  },
  {
    "id": 22,
    "name": "Antonio Vivaldi",
    "nationality": "Italian",
    "lifespan": "1678-1741",
    "created_at": "2019-05-01T01:28:48.226Z",
    "updated_at": "2019-05-01T01:28:48.226Z"
  },
  {
    "id": 29,
    "name": "Arcangelo Corelli",
    "nationality": "Italian",
    "lifespan": "1653-1713",
    "created_at": "2019-05-01T01:28:48.237Z",
    "updated_at": "2019-05-01T01:28:48.237Z"
  }
]
```
#### GET '/api/v1/compositions'
Get all compositions
**Example Response**
```
[
  {
    "id": 44,
    "name": "Messiah",
    "arrangedFor": "SATB Choir, oboes, trumpets, timpani, strings and basso continuo (harpsichord, violoncello, violone, bassoon)",
    "composer_id": 25,
    "created_at": "2019-05-01T01:28:48.244Z",
    "updated_at": "2019-05-01T01:28:48.244Z"
  },
  {
    "id": 38,
    "name": "Magnificat",
    "arrangedFor": "SATB choir",
    "composer_id": 22,
    "created_at": "2019-05-01T01:28:48.242Z",
    "updated_at": "2019-05-01T01:28:48.242Z"
  },
  {
    "id": 61,
    "name": "O Magnum Mysterium",
    "arrangedFor": "SATB voices",
    "composer_id": 29,
    "created_at": "2019-05-01T01:28:48.254Z",
    "updated_at": "2019-05-01T01:28:48.254Z"
  }
]
```

#### GET '/api/v1/composers/:id'
Get a particular composer by id
**Example Response**
```
{
  "id": 25,
  "name": "George Frideric Handel",
  "nationality": "German",
  "lifespan": "1685-1759",
  "created_at": "2019-05-01T01:28:48.226Z",
  "updated_at": "2019-05-01T01:28:48.226Z"
}
```

#### GET '/api/v1/compositions/:id'
Get a particular composition by id
**Example Response**
```
{
  "id": 55,
  "name": "Laboravi Clamans",
  "arrangedFor": "SSATB choir, organ",
  "composer_id": 28,
  "created_at": "2019-05-01T01:28:48.251Z",
  "updated_at": "2019-05-01T01:28:48.251Z"
}
```

#### GET '/api/v1/composers/:id/compositions'
Get all compositions of a composer by composer id
**Example Response**
```
[
  {
    "id": 41,
    "name": "Joy to the World",
    "arrangedFor": "SATB choir",
    "composer_id": 25,
    "created_at": "2019-05-01T01:28:48.244Z",
    "updated_at": "2019-05-01T01:28:48.244Z"
  },
  {
    "id": 42,
    "name": "Praise the Lord",
    "arrangedFor": "SAB choir",
    "composer_id": 25,
    "created_at": "2019-05-01T01:28:48.246Z",
    "updated_at": "2019-05-01T01:28:48.246Z"
  },
  {
    "id": 44,
    "name": "Messiah",
    "arrangedFor": "SATB Choir, oboes, trumpets, timpani, strings and basso continuo (harpsichord, violoncello, violone, bassoon)",
    "composer_id": 25,
    "created_at": "2019-05-01T01:28:48.244Z",
    "updated_at": "2019-05-01T01:28:48.244Z"
  }
]
```

### POST
#### POST '/api/v1/composers'
Add a composer to the database
**Request-Body Input Description**
| Key Name | Data Type | Description |
| ---- | ---- | ---- |
| `name` | `string` | Composer's full name |
| `nationality` | `string` | Birth heritage of composer |
| `lifespan` | `string` | year born to year of death |
**Example Request**
```
{
  "name": "Mason France",
  "nationality": "American",
  "lifespan": "1640-1680"
}
```

#### POST '/api/v1/composers/:id/composition'
Add a composition to the database.
**Note: This compositions composer must also be in the database**
Make get request to composers to see if composer is in the database. If so, use their id in the url. If not, consider submitting their full name, nationality, and lifespan to first make a POST for a new composer. (see POST '/api/v1/composers')
**Request-Body Input Description**
| Key Name | Data Type | Description |
| ---- | ---- | ---- |
| `name` | `string` | Composition's name |
| `arrangedFor` | `string` | Description of the voice parts and instrumentation |
**Example Request**
```
{
  "name": "Holla Back Girl",
  "arrangedFor": "1 Sop solo, SSAATB choir, drum synth, full orchestra"
}
```

### Delete
#### DELETE '/api/v1/composers/:id'
**Warning: Deleting a composer will delete all of their compositions**
Delete a composer of a given id
**Example Response**
```
  `Successful delete of composer id 29`
```

#### DELETE '/api/v1/compositions/:id'
Delete a composition of a given id
**Example Response**
```
  `Successful delete of composition id 18`
```
