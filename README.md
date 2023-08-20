# Bookadinho

A website aimed at sharing books and democratizing reading.

## Summary

1. <a href="#aboutproject">About project</a>
2. <a href="#maintechnologies">Main technologies used in the project</a>
3. <a href="#endpoints">Endpoints</a>
   1. <a href="#Route/profiles">Route /profiles</a>
      1. <a href="#POST/profile/authorization" >POST /profile/authorization</a>
      2. <a href="#GET/profiles" >GET /profiles</a>
      3. <a href="#GET/profile/:id" >GET /profile/:id</a>
      4. <a href="#POST/profile" >POST /profile</a>
      5. <a href="#PUT/profile" >PUT /profile</a>
      6. <a href="#DELETE/profile" >DELETE /profile</a>
      7. <a href="#PUT/profile/password" >PUT /profile/password</a>
   2. <a href="#Route/books">Route /books</a>
      1. <a href="#GET/books">GET /books</a>
      2. <a href="#GET/book/:id">GET /book/:id</a>
      3. <a href="#POST/book">POST /book</a>
      4. <a href="#PATCH/book/read/:id">PATCH /book/read/:id</a>
      5. <a href="#PATCH/book/change/:id">PATCH /book/change/:id</a>
      6. <a href="#DELETE/book/:id">DELETE /book/:id</a>
4. <a href="#finalconsiderations">Final considerations</a>

<span id="aboutproject"></span>

## About project

This project is divided into two repositories, the back-end, the one you're looking at, and the front-end, which can be accessed by clicking on the link: **_[front-end-bookadinho](https://github.com/paulacynthia/front-end-bookadinho)_**.

**_OBS:_**

- _The application is for academic and disciplinary purposes, so there will be constant changes to the structure, coding and dependencies of the project._
- _It's in mock-up form, i.e. it doesn't have a database yet._
- _Any user or book registration is not permanent._

<span id="maintechnologies"></span>

## Main technologies used in the project:

- Node.js
- Express.js
- TypeScript
- JSONWebToken

<span id="endpoints"></span>

## Endpoints:

The routes are /books and /profiles, both of which have create, query, update and delete (CRUD) routes.

<span id="Route/profiles"></span>

### Route /profiles

<span id="POST/profile/authorization"></span>

#### POST /profile/authorization

- In order to query, update or delete a profile or book, you must have a token.
- This token is returned when the user and password have been validated.

<br>

| Value     | Required | Note                 | Data type |
| --------- | -------- | -------------------- | --------- |
| user_name | Yes      | Informed on the body | String    |
| password  | Yes      | Informed on the body | String    |

```bash
  curl --request POST \
    --url https://bookadinho-api.onrender.com/profile/authorization \
    --header 'Content-Type: application/json' \
    --data '{
      "user_name": "<user_name>",
      "password": "<password>"
    }'
```

<span id="GET/profiles"></span>

#### GET /profiles

- It will return all the registered profiles.

<br>

| Value | Required | Note                   | Data type |
| ----- | -------- | ---------------------- | --------- |
| Token | Yes      | Informed in the header | String    |

```bash
  curl --request GET \
    --url https://bookadinho-api.onrender.com/profiles \
    --header 'Authorization: <token>'
```

<span id="GET/profile/:id"></span>

#### GET /profile/:id

- It will return the profile registered with the id entered.

<br>

| Value | Required | Note                   | Data type |
| ----- | -------- | ---------------------- | --------- |
| Id    | Yes      | Informed on the route  | Number    |
| Token | Yes      | Informed in the header | String    |

```bash
  curl --request GET \
    --url https://bookadinho-api.onrender.com/profile/:id \
    --header 'Authorization: <token>'
```

<span id="POST/profile"></span>

#### POST /profile

- It will create a new profile.

<br>

| Value           | Required | Note                 | Data type                    |
| --------------- | -------- | -------------------- | ---------------------------- |
| user_name       | Yes      | Informed on the body | String                       |
| name            | Yes      | Informed on the body | String                       |
| password        | Yes      | Informed on the body | String                       |
| email           | Yes      | Informed on the body | String                       |
| description     | No       | Informed on the body | String                       |
| likes           | No       | Informed on the body | Array['Like1', 'Like2', ...] |
| latest_readings | No       | Informed on the body | Array['Like1', 'Like2', ...] |
| photo           | No       | Informed on the body | String                       |

```bash
  curl --request POST \
    --url https://bookadinho-api.onrender.com/profile \
    --header 'Content-Type: application/json' \
    --data '{
      "user_name": "<user_name>",
      "name": "<name>",
      "password": "<password>",
      "email": "<email>"
    }'
```

<span id="PUT/profile"></span>

#### PUT /profile

- It will update some information in the logged-in profile.

<br>

| Value           | Required | Note                   | Data type                    |
| --------------- | -------- | ---------------------- | ---------------------------- |
| Token           | Yes      | Informed in the header | String                       |
| User_name       | Yes      | Informed on the body   | String                       |
| Name            | Yes      | Informed on the body   | String                       |
| Password        | Yes      | Informed on the body   | String                       |
| Email           | Yes      | Informed on the body   | String                       |
| Description     | No       | Informed on the body   | String                       |
| Likes           | No       | Informed on the body   | Array['Like1', 'Like2', ...] |
| Latest_readings | No       | Informed on the body   | Array['Like1', 'Like2', ...] |
| Photo           | No       | Informed on the body   | String                       |

```bash
  curl --request PUT \
    --url https://bookadinho-api.onrender.com/profile \
    --header 'Authorization: <token>' \
    --header 'Content-Type: application/json' \
    --data '{
      "user_name": "<user_name>",
      "name": "<name>",
      "password": "<password>",
      "email": "<email>"
    }'
```

<span id="DELETE/profile"></span>

#### DELETE /profile

- Will delete the logged-in user's profile.

<br>

| Value | Required | Note                   | Data type |
| ----- | -------- | ---------------------- | --------- |
| Token | Yes      | Informed in the header | String    |

```bash
  curl --request DELETE \
    --url https://bookadinho-api.onrender.com/profile \
    --header 'Authorization: <toke>'
```

<span id="PUT/profile/password"></span>

#### PUT /profile/password

- It will update the password of the logged-in user.

<br>

| Value    | Required | Note                   | Data type |
| -------- | -------- | ---------------------- | --------- |
| Token    | Yes      | Informed in the header | String    |
| Password | Yes      | Informed on the body   | String    |

```bash
  curl --request PUT \
    --url https://bookadinho-api.onrender.com/profile/password \
    --header 'Authorization: <token>' \
    --header 'Content-Type: application/json' \
    --data '{
      "password": "<password>"
    }'
```

<span id="Route/books"></span>

### Route /books

<span id="GET/books"></span>

#### GET /books

- It will return all the books registered.

```bash
curl --request GET \
  --url https://bookadinho-api.onrender.com/books
```

<span id="GET/book/:id"></span>

#### GET /book/:id

- It will return the book registered with the id entered.

<br>

| Value | Required | Note                  | Data type |
| ----- | -------- | --------------------- | --------- |
| Id    | Yes      | Informed on the route | Number    |

```bash
  curl --request GET \
    --url https://bookadinho-api.onrender.com/book/:id
```

<span id="POST/book"></span>

#### POST /book

- It will create a new book.

<br>

| Value       | Required | Note                   | Data type |
| ----------- | -------- | ---------------------- | --------- |
| Token       | Yes      | Informed in the header | String    |
| Title       | Yes      | Informed on the body   | String    |
| Author      | Yes      | Informed on the body   | String    |
| Description | Yes      | Informed on the body   | String    |
| Is_read     | Yes      | Informed on the body   | Boolean   |
| Photo       | No       | Informed on the body   | String    |

```bash
  curl --request POST \
    --url https://bookadinho-api.onrender.com/book \
    --header 'Authorization: <token>' \
    --header 'Content-Type: application/json' \
    --data '{
      "name": "<name>",
      "author": "<author>",
      "description": "<description>",
      "photo": "<photo>",
      "is_read": <is_read>
    }'
```

<span id="PATCH/book/read/:id"></span>

#### PATCH /book/read/:id

- It will update the book's reading status.

<br>

| Value | Required | Note                   | Data type |
| ----- | -------- | ---------------------- | --------- |
| Token | Yes      | Informed in the header | String    |
| Id    | Yes      | Informed on the route  | Number    |

```bash
  curl --request PATCH \
  --url https://bookadinho-api.onrender.com/book/read/:id \
  --header 'Authorization: <token>' \
```

<span id="PATCH/book/change/:id"></span>

#### PATCH /book/change/:id

- It will update the book's exchange status.

<br>

| Value | Required | Note                   | Data type |
| ----- | -------- | ---------------------- | --------- |
| Token | Yes      | Informed in the header | String    |
| Id    | Yes      | Informed on the route  | Number    |

```bash
  curl --request PATCH \
  --url https://bookadinho-api.onrender.com/book/read/:id \
  --header 'Authorization: <token>' \
```

<span id="DELETE/book/:id"></span>

#### DELETE /book/:id

- It will delete the book with the id entered.

<br>

| Value | Required | Note                   | Data type |
| ----- | -------- | ---------------------- | --------- |
| Token | Yes      | Informed in the header | String    |
| Id    | Yes      | Informed on the route  | Number    |

```bash
  curl --request DELETE \
    --url https://bookadinho-api.onrender.com/book/:id \
    --header 'Authorization: <token>' \
```

<span id="finalconsiderations"></span>

### Final considerations:

_"Work around we accept, what we don't accept is defeat" - My clan_
