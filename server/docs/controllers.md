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
```js
res.json({ sucess: true, movie, dateTime });
```
This data can be added to both when showing individal movie and when user are selecting their shows.


## Seats Available

When user visits a show, they need to select the seats with time slot. So, here we will first see which seats are booked, and that came from the api call

### Synchronization Problem 

Now, here we can encounter synchronization problem where if multiple user books same show with same seats at same time.<br>
> To show the avilable seats we can use 2 ways:<br>
1. Highlight the booked seats on frontend by just fetching the `bookedSeats` fron backend for a show.
2. Hightlight the booked seats, also check if that seat is already booked in that show.

User can face synchronization problem where a seat can be double booked if both user select the same seat for a movie.
The other problem is if user bypass the booked seats and sends a post request to backend than it may cause double booking.<br>

We can solve this problem by adding a filter which check whether the for a user the selcted seats are not present is the database.
```js
const checkSeatAvailability = async(showId, selectedSeats) => {

  // Checked whether selectedSeats are already booked for `showId`

}
```


With the seat selction we can save the booking data along with sending which seats were booked for a particular show.
```js
createBooking -> checkSeatAvailability
```

## Admin Dashboard

In admin dashboard we need the active movie, which exist in the `Movie` collection and we use the `_id` from those movie to fetch the `showPrice` & `occupiedSeats` from `Show` collection to display the data:
``` js
Total Bookings, // SUM(occupiedSeats.length)
Total Revenue, // SUM(occpiedSeats.length * showPrice)
Active Movies, // COUNT(Movie)
Total Users
```
