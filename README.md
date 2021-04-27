# Full-Stack Application Demo

## Intro

This app is a MERN (MongoDB, Express, React and Node) app.

## Server

The server is an express server (mainly an API server, except in production where it serves files from the client folder)

### API Routes

Routes begin with `/api/v1/` and then the model they are manipulating. There are `bookings` routes set up. The model for a product is:

```javascript
  startDateTime: {
    type: Date,
    required: true,
  },
  court: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
```

sent as `application/json`

- GET `/api/v1/bookings` - gets all bookings
- GET `/api/v1/bookings/1234` - gets the upcoming bookings for the user with a userId of `1234`
- POST `/api/v1/bookings` - adds a product (you need to send data in the request body, as shown above)
- DELETE `api/v1/bookings/1234`deletes the Booking with an id of`1234` (404 if not found)

## Auth0 Settings

To use this app yourself you'll need to set up a domain with Auth0 and set up an SPA application and within that an API.

On the client you'll need a `.env` file, which looks like:

```bash
AUTHO_DOMAIN=mikeleguiluz.eu.auth0.com
AUTH0_AUDIENCE="http://localhost:3000/api/v1"
```

Reference article: <https://auth0.com/blog/node-js-and-typescript-tutorial-secure-an-express-api/#Set-Up-an-Authorization-Service>
