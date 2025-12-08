# Purpose

Explaining how the backend talks to third-party APIs (TMDB) and how the main show/booking endpoints work.

## Short overview:

This document describes the TMDB integration and the main API endpoints used by the frontend. It lists required environment variables, quick setup notes, authentication details, and where to test each endpoint (Postman / browser). It assumes a Node.js + Express backend and MongoDB (Mongoose) for persistence.

## Environment / required config:

- TMDB_BEARER_TOKEN: the Bearer token you get from TMDB (used in the Authorization header).
- MONGO_URI: connection string for the MongoDB database.
- PORT: server port (default 3000)

## Testing & Postman:

- Recommend adding a collection with requests:
  - GET /api/show/now-playing
  - POST /api/show/add (admin)
  - GET /api/show/all
  - GET /api/show/:id
  - POST /api/booking/create
  - PUT /api/booking/seats/:showId
  - admin endpoints under /api/admin/\*
- The required header is: (Auth header, Content-Type: application/json).

## TMDB API

We are fetching movie list from `TMDB` (The Movie Database) API, which needs a header to validate user key. The jey is generated after creating an account.

```js
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${Our KEY}`
  }
};
```

## API Testing

### Fetching Movies from TMDB API

When the clent send a rquest to `"/api/show/now-playing"`. The logic is divided into multiple segments like, we visit:<br>

- `server.js` and check is route is `/api/show` then it is routed to `showRouter` as this file conatins all routing for shows.
- Now inside `showRouter` we check the route `/now-playing'` and route the controller to `showContoller.js` where the function return a json showing the status `true / false` and return the data as `movies / error message` respectively.

Now we can test this endpoint using `Postman` by sending a GET reuest to `/api/show/now-playing`/

<img src="../public/api-postman.png" width="380">

### Adding Shows

When Admin want to add a shows from the TMDB API to the application, admin will sent an HTTP request to the backend with:

```js
movieId, showPrice, showsInput;
```

And with this data we fetch a movie using movieId, and another API to fetch cast member using the same movieId and we save both the movie and shows in the database.

We use `promise.all` to fetch movie detail and cast members as both are on different endpoints.
`const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([])`.

The endpoint for adding shows is `http://localhost:3000/api/show/add`, which on success add movie and shows.

<img src="../public/api-add-show.png" width="380">

### Display Shows to Users

When user visit the main page of the application they see the shows which came from the `Show` collection with unique movies.<br>
This data only depends on the `Show` collection, as we are only fetching the movie data from the `Show` which are unique are are scheduled to run in future, The shows are scheduled by admin.<br>
The endpoint for that is `http://localhost:3000/api/show/all`

<img src="../public/api-all-shows.png" width="380">

### Individual Movies

When user click on any movie, they will get all the data of that movies like title, overview, casts, etc. We can fetch the data of individual movies using movie id which we get from query parameter, like `http://localhost:5173/movies/324544`.

<img src="../public/api-single-show.png" width="380">

## Seats Available

When user visits a show, they need to select the seats with time slot. So, here we will first see which seats are booked, and that came from the api call.
We will have 2 enpoints when user tries to book a show, which are: <br>

```js
// Endpoint to create booking while also checking seats availibility

http://localhost/api/booking/create

// Endpoint to update the booked seats

http://localhost/api/booking/seats/:showId
```

## Admin Dashboard

In admin dashboard we need the active movie, which exist in the `Movie` collection and we use the `_id` from those movie to fetch the `showPrice` & `occupiedSeats` from `Show` collection to display the data:

```js
Total Bookings, // Paid bookings
Total Revenue, // SUM(bookings.amount)
Active Movies, // Show.dateTime >= current date
Total Users // COUNT(USER)
```

When soemone visits `http://localhost/api/admin/dashboard` the data for the dashboard is send in json, along with the check, whther user is admin or not.

## Admin List Shows

The list show section for admin conatins movie name, show time, no of seats booked for that show and earning, all the data for that can be derived from `Show` collection.

```js
Show.find({ showDateTime: { $gte: new Date() } })
  .populate("movie")
  .sort({ showDateTime: 1 });
```

When soemone visits `http://localhost/api/admin/all-show` the data for the list shows is send in json.

## Admin List Bookings

The list bookings section for admin conatins the user name, movie name, showtime. That can be derived from `Booking` coolection which is linked with `User`, `Show`.

```js
Booking.find({})
  .populate("user")
  .populate({
    path: "show",
    popluate: { path: "movie" },
  })
  .sort({ createdAt: -1 });
```

When soemone visits `http://localhost/api/admin/all-bookings` the data for the bookings is send in json.
