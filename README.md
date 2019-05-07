# BaroqueChoralComposers
Every choir student should sing something from the Baroque time period. The embellished, complex vocal lines are great learning experiences for any singer. This API holds information about Baroque choral composers and their compositions. Users may add composers and compositions as well. This is build with Knex and Node.js/Express, using PostgreSQL for a database.

## Deployment
[Baroque composers on Heroku](https://baroque-choral-composers.herokuapp.com/api/v1/composers/)

# API Calls
## Get
### GET */api/v1/composers*
Get all composers from database.

**Example Response:**
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
### GET */api/v1/compositions*
Get all compositions from database.

**Example Response:**
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

### GET */api/v1/composers/:id*
Get a particular composer by id.

**Example Response:**
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

### GET */api/v1/compositions/:id*
Get a particular composition by id.

**Example Response:**
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

### GET */api/v1/composers/:id/compositions*
Get all compositions of a composer by composer id.

**Example Response:**
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

## POST
### POST */api/v1/composers*
Add a composer to the database. New id is returned if successful.

**Request-Body Input Description**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Composer's full name |
| **nationality** | `string` | Birth heritage of composer |
| **lifespan** | `string` | year born to year of death |

**Example Request Body:**
```
{
  "name": "Mason France",
  "nationality": "American",
  "lifespan": "1640-1680"
}
```

**Example Response:**

```
{
  "id": 64
}
```

### POST */api/v1/composers/:id/composition*
Add a composition to the database. New id is returned if successful. 

**Note: This compositions composer must also be in the database**

Make get request to composers to see if composer is in the database. If so, use their id in the url. If not, consider submitting their full name, nationality, and lifespan to first make a POST for a new composer. (see POST '/api/v1/composers')

**Request-Body Input Description**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Composition's name |
| **arrangedFor** | `string` | Chorus voice part/instrumentation description |

**Example Request Body:**
```
{
  "name": "Holla Back Girl",
  "arrangedFor": "1 Sop solo, SSAATB choir, drum synth, full orchestra"
}
```

**Example Response:**

```
{
  "id": 32
}
```

## Put
### PUT */api/v1/composers/:id*
Replace a composer at id in url. All fields must be entered.

**Request-Body Input Description**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Composer's full name |
| **nationality** | `string` | Birth heritage of composer |
| **lifespan** | `string` | year born to year of death |

**Example Request Body:**
```
{
  "name": "Nikola Jokic",
  "nationality": "Serbian",
  "lifespan": "1639-1692"
}
```

**Example Response:**

```Replacement of composer id 22 complete.```

### PUT */api/v1/compositions/:id*
Replace a composition at id in url. All fields must be entered.

**Note: Cannot change a composition's composer_id. If composer_id was incorrectly input, please delete entry and create a new one**

**Request-Body Input Description**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Composition's name |
| **arrangedFor** | `string` | Chorus voice part/instrumentation description |

**Example Request Body:**
```
{
  "name": "Nikola Jokic",
  "arrangedFor": "double chorus"
}
```

**Example Response:**

```Replacement of composition id 22 complete.```

## Patch
### PATCH */api/v1/composers/:id*
Edit a composer at id in url. 

**Request-Body Input Description**

Any of the three listed keys can be included, all are not required.

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Composer's full name |
| **nationality** | `string` | Birth heritage of composer |
| **lifespan** | `string` | year born to year of death |

**Example Request Body:**
```
{
  "nationality": "English",
  "lifespan": "1660- 1701"
}
```

**Example Response:**

```Patch of composer id 34 complete.```

### PATCH */api/v1/compositions/:id*
Edit a composition at id in url. 

**Note: Cannot change a composition's composer_id. If composer_id was incorrectly input, please delete entry and create a new one**

**Request-Body Input Description**

Either or both key can be included, obth are not required

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Composition's name |
| **arrangedFor** | `string` | Chorus voice part/instrumentation description |

**Example Request Body:**
```
{
  "name": "Update to Songname"
}
```

**Example Response:**

```Patch of composition id 21 complete.```

## Delete
### DELETE */api/v1/composers/:id*
#### **_Warning: Deleting a composer will delete all of their compositions_**

Delete a composer of a given id

**Example Response:**
```
  `Successful deletion of composer id 29`
```

### DELETE */api/v1/compositions/:id*
Delete a composition of a given id

**Example Response:**
```
  `Successful deletion of composition id 18`
```
