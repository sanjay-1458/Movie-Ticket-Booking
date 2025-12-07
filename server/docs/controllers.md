#

First we get the current showing movie from `TMDB (The Movie Database)` by sending a GET request.

FOr that we need `TMDB_API_KEY` which is `API Read Access Token` and can be accessed by creating an account on it. For this project the `version-3` is been used.

We need to fetch new for `Admin` when admin in in `Add shows` section.

We get the movie list using the api call.

``` js
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${Our KEY}`
  }
};
```
And send the response as `res.json({sucess:true,movies:movies})`.

