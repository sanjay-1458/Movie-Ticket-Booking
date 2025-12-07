#

## Fetch Movies

First we get the current showing movie from `TMDB (The Movie Database)` by sending a GET request.

For that we need `TMDB_API_KEY` which is `API Read Access Token` and can be accessed by creating an account on it. For this project the `version-3` is been used.

We need to fetch new for `Admin` when admin in in `Add shows` section.

We get the movie list using the api call.

```js
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${Our KEY}`
  }
};
```

And send the response as `res.json({sucess:true,movies:movies})`.

## Add Shows

Admin sends an HTTP request to `/api/show/add`, where the data conatins:

```js
{
  movieId, 
  showPrice, 
  showsInput
} = req.body
```

Which helps admin to store the movie and shows in the database.



## Now Showing Movies

When user first visit our website, the main page contains a section of `Now Showing`, which contains all the movies from database, so user can select the movie, and proceed further.<br>

Fetch the shows from the `Show` collection and in homepage we only need the unique movie, we remove the duplicate movies.<br>
The `Show` schema has `movie` which has reference to `Movie` collection, so we use `populate` which converts:

```js
"movie": "67ab3fd7e8..."

// to

"movie": {
  "_id": "67ab3fd7e8...",
  "title": "Avatar 3",
  "runtime": 140,
  ...
}
```
```js
Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1});
```

## Individual Movies

When user click on any movie, they will get all the data of that movies like title, overview, casts, etc. We can fetch the data of individual movies using movie id which we get from query parameter, like `http://localhost:5173/movies/324544`.

## Admin Dashboard

In admin dashboard we need the active movie, which exist in the `Movie` collection and we use the `_id` from those movie to fetch the `showPrice` & `occupiedSeats` from `Show` collection to display the data:
``` js
Total Bookings, // SUM(occupiedSeats.length)
Total Revenue, // SUM(occpiedSeats.length * showPrice)
Active Movies, // COUNT(Movie)
Total Users
```
