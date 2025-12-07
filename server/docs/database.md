# Database

### MongoDB Atlas

It is a cloud-based database, it gives us database as a service, it supports cloud providers like: `"AWS", "Azure", "Google Cloud"`. <br>
It provides automatic scaling and backups, and we can easily connect by using simple `MONGODB_URI` or MongoDB connection string which looks like `mongodb+srv://username:password@cluster0.mongodb.net`. It is used to connect our application to the MongoDB database (local or cloud).

### URI

It is just a string (`mongodb+srv://...`) containing information about: the MongoDB server, username, password.
It is just instruction for the clietn, where to connect.

## Connection to Database

App is connected to database using MoongoDB URI, where after connecting we can create any database.

Mongoose is used for abstraction where we first connect using URI, then create schema and save record.

### Schema

It is like giving structure, and validate data in a collection. <br>
For an `User` we store their name, email, and image. So the schema can be defined as.

```js
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
```

### Model

By creating model we are making a collection which follows the same schema and constriant

```js
const User = mongoose.model("User", userSchema);
```

### New User

Now, we can create a user (document) using model, such that the new user follows that model.

```js
const user = new User({
  name: "John",
  email: "john@example.com",
  password: "123456",
});

await user.save(); // <-- manually saving
```

---

> Overall the steps from connection to saving data using mongoose can be described as:

```js
await mongoose.connect(URI);

// Create a Schema

const userSchema = new mongoose.Schema();

// Create a user model

const User = mongoose.model("User", Schema);

// Create a record

await User.create({}); // -> Automatic save
```

---

---

---

With out mongoose one would have to connect to MongoClient as described:

### MongoClient

Used to connect Node.js application to MongoDB, it extablish a connection to a MongoDB server, allow us to perform CRUD operation, manages multiple connection.
It is just an object which knows about URI.

### client.connect()

This establish the network connection to MongoDB. <br>
It loacte the server using URI stored in MongoClient.<br>
Opens a TCP connection to the MongoDB server.<br>
Authnticate user name and password in URI. <br>
Setup connection pooling.

### client.db()

Select a specific database after client is connected.<br>
It returns a database object to interact with database.

---

<table border="1" cellpadding="8" cellspacing="0">
  <thead>
    <tr>
      <th>Component</th>
      <th>Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>MongoClient</td>
      <td>Manager handling pooled connections to MongoDB.</td>
    </tr>
    <tr>
      <td>URI</td>
      <td>Provides cluster location, auth, options, protocol.</td>
    </tr>
    <tr>
      <td>client.connect()</td>
      <td>Executes DNS, TCP, TLS, authentication, pool creation.</td>
    </tr>
    <tr>
      <td>client.db()</td>
      <td>Lightweight object referring to a database using existing connection.</td>
    </tr>
    <tr>
      <td>collection()</td>
      <td>Interface to perform CRUD operations.</td>
    </tr>
  </tbody>
</table>

```js
Node App -----> MongoClient created with URI
         |
         | (client.connect)
         V
 DNS lookup (if +srv)
 TLS handshake
 Authentication
 Replica set discovery
 Connection pool established
         |
         V
 client.db("myDatabase")
         |
         V
 db.collection("users")
         |
         V
 queries, inserts, updates, deletes

```


## Movie Collection

The schema conatins the basic details we need to fullfill the requirement of what user sees in the frontend, like movie name, casts, etc.

``` js
const movieSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    backdrop_path: {
      type: String,
      required: true,
    },
    release_date: {
      type: String,
      required: true,
    },
    original_language: {
      type: String,
    },
    tagline: {
      type: String,
    },
    genres: {
      type: Array,
      required: true,
    },
    casts: {
      type: Array,
      required: true,
    },
    vote_average: {
      type: Number,
      required: true,
    },
    runtime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
```
