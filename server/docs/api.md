## API Testing

### Fetching Movies from TMDB API

When the clent send a rquest to `"/api/show/now-playing"`. The logic is divided into multiple segments like, we visit:<br>
- `server.js` and check is route is `/api/show` then it is routed to `showRouter` as this file conatins all routing for shows.
- Now inside `showRouter` we check the route `/now-playing'` and route the controller to `showContoller.js` where the function return a json showing the status `true / false` and return the data as `movies / error message` respectively.


Now we can test this endpoint using `Postman` by sending a GET reuest to `/api/show/now-playing`/
<img src="../public/api-postman.png" width="380">