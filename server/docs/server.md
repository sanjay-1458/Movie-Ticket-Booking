## Express

To create a single Express apllication object we do `app = express()`. Now this object will have:

```cpp
app.get()
app.post()
app.use()
app.listen()
```

```cpp
    ┌─────────────────┐
    │   express()     │
    │  (factory)      │
    └─────────────────┘
            │
call the function
            ▼
    ┌─────────────────┐
    │      app        │
    │ (server object) │
    ├─────────────────┤
    │ app.get()       │ <-- define routes
    │ app.post()      │
    │ app.use()       │ <-- add middleware
    │ app.listen()    │ <-- start server
    └─────────────────┘

```

<strong>The server is being initialized with some middleware and basic routing which includes:</strong> <br>

> Converting request to JSON using `express.json()` middleware: `app.use(express.json());`

> CORS is enabled where orgin can be any, it is only for development, for production the origin need to be specific with their proper methods and header, `app.use(cors())`

Connect to database using mongoose using `mongoose.connect(URI)`.

Integrate with clerk middleware to make consistent user across frontend and backend.
`app.use(clerkMiddleware());`

Based on the main routes we can specify all routes in basic broad routes like:

```js
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/show", showRouter);

app.use("/api/booking", bookingRouter);

app.use("/api/admin", adminRouter);
```
