# Overview

This project (server) deals with how we fetch movie from a third-party-API which is TMDB API, and how that same data is used across multiple endpoints within the application.

It contains `API Documenatation & Testing`, `UML Diagram`, `Clerk for Authentication`, etc.

<img src="./public/uml-design.png" width="650">

## Server Setup

Creating a `package.json` which is used to manage dependencies, run scripts, contains meta-data about the project, make environment consistent, for client side `package.json` is automatically created when we use `npm create vite@latest`



# Backend Documentation

This contains all documentation required to understand how the backend works,
including APIs, controllers, middleware, authentication, background jobs, and overall system architecture.

---

## 📘 Documentation Overview

---

### 🔹 API

**File:** `/docs/api.md` [Link](docs/api.md)<br>
Details backend API structure, endpoint definitions, request/response formats, and Postman testing workflow.

---

### 🔹 Clerk & Inngest

**File:** `/docs/clerk-inngest-integration.md` [Link](docs/clerk-inngest-integration.md)<br>
Explains backend authentication using Clerk and async job handling using Inngest event handler.

---

### 🔹 Controllers

**File:** `/docs/controllers.md` [Link](docs/controllers.md)<br>
Contains controller logic, how requests are processed, validated, and mapped to client operations.

---

### 🔹 Database

**File:** `/docs/database.md` [Link](docs/database.md)<br>
Documents database connection, schemas, relationships, and data-handling patterns.

---

### 🔹 Middleware

**File:** `/docs/middleware.md` [Link](docs/middleware.md)<br>
Covers global and route-level middleware for authentication, validation, error handling, and security.

---

### 🔹 Routes

**File:** `/docs/routes.md` [Link](docs/routes.md)<br>
Describes backend routing structure, route grouping, protected routes, and mapping to controllers.

---

### 🔹 Server

**File:** `/docs/server.md` [Link](docs/server.md)<br>
Explains how the backend server initializes, loads configuration, registers middleware, and binds routes.

---

### 🔹 Notification

**File:** `docs/notification.md` [Link](docs/notification.md)<br>
We send notification when user pay for a show, reminder for a show.

---

### 🔹 Stripe Integration

**File:** `/docs/stripe-integration.md` [Link](docs/stripe-integration.md)<br>
Documents payment workflow, Stripe API usage, webhook handling, and transaction verification.

---

### 🔹 System Design

**File:** `/docs/system-design.md` [Link](docs/system-design.md)<br>
Provides a high-level architectural overview of backend components, data flow, and scalability patterns.

---




### CommonJS vs ES Modules

<strong>CommonJS</strong><br>
The default Node.js module system, it uses `require` and `module.exports`, it is deafult, or we can check that in `package.json` as: `"type":"commonjs"`.
It uses synchronous loading.

It uses `.js` (default, depend on package), `.cjs` (forces CommonJS even if project is `"type":"module"`) extensions.

```js
// Importing a file

const math = require("./math.js");

// Importing specific property

const { add, subtract } = require("./math.js");

// Default export

module.exports = add;

// Multiple export

module.exports = {
  add,
  subtract,
};
```

It supports `__dirname`, `__filename` automatically.
It is supported in `Node.js`

<strong>ES Modules</strong><br>
It is a modern JavaScript module system (ES6), it uses `import`, `export`.
It uses asynchronous loading.

To enable it we must add / make `"type":"module"` in `package.json`.

It uses `.js` (default, depend on package), `.mjs` (it means ES Module always `"type":"module"`) extensions.

```js
// Named imports

import { add, subtract } from "./math.js";

// Import everything

import * as math from "./math.js";

// IMport with rename

import { add as sum } from "./math.js";

// Default export

export default function add(a, b) {
  return a + b;
}

// Named export

export const PI = 3.14;

// Export multiple items

export { add, subtract };
```

It does not support `__dirname` and `__filename`, we have to manually create them.
It is supported in `Node + Browser`.

### Bundle

Browser does not understand `JSX`, `React`, so a bundle is generated for browser, and is basically a final output that contains all of our JavaScript code merged and optimized into fewer files.

```css
src/
  App.jsx
  main.js
  components/
    Header.jsx
    Footer.jsx
```

Is bundled to something like:

```css
dist/
  index.html
  assets/
    app.23948.js
    app.34985.css
```

We need bundle when we ship frontend to browser, a bundle transforms everything into browser-compatible code.

How bundle is created:

1. Combine files (bindling) <br>
   <i>If we import multiple file data into a single file thab bundler combines files into one file such that browser makes fewer request.</i>

2. Convert modern JS to old JS (transpiling) <br>
   <i>Convert to old JS like, converting ES6 -> ES5.</i>

3. Convert JSX to plain JS <br>
   <i>Turns JSX into JS so the browser can understand it.</i>

4. Convert imports from node_modules to code <br>
   <i>Browser cannot read imports from node_modules so the bundler converts those into code the browser can run.</i>

5. Tree-Shaking <br>
   <i>Remove unused code to reduce bundle size.</i><br>

6. Minification
   <i>Make the code smaller by removing spaces, shorten variable name, compress JS</i>

7. Asset optimization
   <i>Compresses images, CSS, fonts, etc</i>

So, bundling turns our whole project into small, optimized package for browsers.

### Tree Shaking

It removes unused code automatically.
When a file export multiple functions, and we only use certain functions, than modern bundler remove those unsed code thus making the bunlde size small, else if affect the bundle which leads to slower application.

Tree Shaking works only with `ES Modules (ESM)`

### HMR

HMR stands for `HOT Module Replacement`. It is a feature used in frontend development where when we update some parts of our code, only that part is updated in browser without full page reload.

When we change a file, HMR injects only the changed module in the running app. The state is preserved, we don't lose react component state, form inputs, or scroll position.

### Dependencies

#### Axios:

Axios is used for making HTTP request, like fetching data, sending data. It is a promised based client library, automatically transform response to JSON. It works in both Node.js and browsers, also supports in older Node version.

#### Cloudinary:

It is a cloud based service to manage images, and videos. It allows our application to upload, store, optimize efficiently. We can handle media without building a custom media server. Cloudinary uses CDN, so when someone request for some assets Cloudinary serves it via a CDN endpoint closest to the user. It does not own its own global distributed CDN hardware, instead it uses other CDN providers.

#### CORS:

CORS is a middleware (a functon which sits between request and response) that enables `Cross-Origin-Resource-Sharing`.
Browser enforces a security policy that prevents request from one origin to another unless `server explicitly allows it`.

Using cors package we can easily configure it to set certain origin, methods and headers.

If client is at `localhost:5173` and it makes request to server at `localhost:3000`, than without cors, the request will fail due to browser's policy.

If we open a plain HTML form page, we either get `"file://"` when we open HTML by double clicking, or at certain port like `localhost:5000`, here the browser will not block the request in first case as a plain HTML form submission is not considered a cross-origin.

When client sends request to server, the server sees the client origin, here `Origin: http://localhost:5173`, now servers checks the allowed origin, if it exists than only server responds.

```js
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

Browser consider origin as a combination of `protocol`, `domain`, and `port`.

1. <strong>Protocol</strong><br>
   Like `http` or `https`

2. <strong>Domain</strong><br>
   Like `localhost` or `example.com`

3. <strong>Port</strong><br>
   Like `3000`or `5173`

Thus origin can be like: `http://localhost:3000`.<br>
For browsers, `http://localhost:3000` and `http://localhost:5173` are different origins, even though the domain is the same.

#### Dotenv:

`process` is a global object in Node that provides information about, and control over cureent Node process.<br>
To access the dat from `.env` file we need to install `dotenv` package. Example : `"process.env.PORT"`, it will be undefined if there is no PORT in `.env` file.

#### Express:

It is Node.js web framwork that simplifies building web server, handling routes, middleware, authentication. etc

#### Mongoose:

Mongoose is an Object Data Modelling library for Node.js and MongoDB.
ODM is a tool that helps ius to interact with NoSQL database using objects in our code.
Without mongoose we have to write raw queries and there is no schema validation. But with mongoose we can have fix schema and validation.

Mongoose provide high level abstraction so that we can easily interact with MongoDB in object oriented way.
