# Middleware

Middleware is a function that sits between request and response, it can modify request and response object, perform some actions like authenication, decide whether to pass control to next middleware.

```js
app.use(function(req, res, next) => {

    // Perform some logic
    next();
})

// or

const middleware = (req, res, next) => {

    // Perform some logic
    next();
}

app.use(middleware);

// If we want to apply middleware only for certain route

app.get('/route', middleware, (req, res) => {

})

// Error handling middlware

app.use((err, req, res, next) => {

    next();
})

```

## Parse JSON

`express.json()` is a built-in middleware in Express which is used to parse incoming JSON data.

When the server recieves a POST request like:

```json
{
  "name": "Alice",
  "age": 25
}
```

In plain Node.js application we would get that data using stream and after that we would convert it to JSON, because data is tranfered as performing JSON.stringify, so we would have to do it as:

```js
let body = "";

req.on("data", (chunk) => {
  data += chunk;
});
req.on("end", () => {
  const parsedData = JSON.parse(body);

  // Now we have same object we get from client
  console.log(parsedData.name);
});
```

So, when we call use middleware `app.use(express.json())`, it internally gathers data from the stream and parse it and store in `req.body`, after that it passes control to next middleware using `next()`.

## Enabling CORS

Since we are not sending and receiving data from same origin, as client and server is on differnt origin we need to setup the CORS, and it is done using middleware.

```js
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
```

CORS middleware should run before any route definition.

## Protect Admin

Since Admin can add movies directly from TMDB API, we need to protect the admin route, so we will use the `userId` from `req.auth()` to validate that user is Admin or not.

And this method exists because we have used clerk middleware which provide us:

```css
req.auth.userId;
req.auth.sessionId;
req.auth.actor;
```

The middleware `protectAdmin` is used to validate the user using `userId` to get their role. If user role is admin only they can access and process to next middleware.

```js
const user = await clerkClient.users.getUser(userId);

if (user.privateMetadata.role !== "admin") {
  // User is not admin
}
```
