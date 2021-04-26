Project brief

## Intro

- Tennis court booking system
- Admin interface
  - modify / delete bookings
  - modify bookings
- customer Interface
  - view available courts in a calendar
  - book spaces

## views

- main view: Overview of today's (maybe a whole week) court availability + login
- book slot view (create)
- my bookings view (update and delete)
- admin-only views
  - mass booking
  - modify/delete by user
  - add/remove users

## Stack

- front-end
  - react
- back-end
  - node
  - express
  - SQL server

## Relationships

- user
  - user name
  - first name
  - last name
  - create bookings
  - booking list (1 to n)
- admin extends user
  - admin-only operations logic
    - delete other user bookings
    - create mass bookings
- booking
  - datetime start
  - timestamp created
  - court number (enum)
  - user (n to 1)
