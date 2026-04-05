# Overview

This is a `Movie-Ticket-Booking` application, where user can book tickets for specific movie, with their desired seats.
The admin can set shows, view the booked seats also motior the earning of each movie.

This project is written with `React`. `TypeScript`, `Node`, `Express`, `MongoDB`, `PostgreSQL`, `Prisma`. Along with the unit test using `Vitest` & `React-Testing-Library`.

This application is build using hybrid database approach. Transaction related to `booking data` and `stripe payment` is handled using relational database due to strong ACID property, and remaining field such as `movies`, `shows` is handled using `mongodb` it can also provide document wise locking but due to scalibility and eventual consistency document database is used.

This application provides feature like adding movies to favorites, booking seats without dealing with double bookings, reserving the booking seats for `10 minutes` if user fail to make payment.

It uses:

<table border>
  <thead>
    <tr>
      <th>Service</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Clerk</td>
      <td>User authentication</td>
    </tr>
    <tr>
      <td>Inngest</td>
      <td>Triggering a function</td>
    </tr>
    <tr>
      <td>Stripe</td>
      <td>Payment integration</td>
    </tr>
    <tr>
      <td>Nodemailer</td>
      <td>Sending mails; SMTP</td>
    </tr>
  </tbody>
</table>



---

<strong>UML Diagram:</strong><br>

<img src="./server/public/uml-design.png" width="680">

---

---

#### After Migrating to PostgreSQL

<img src="./assets/supabase-schema-kckctpynyihbsyquoxrt.png" width="540">

---


# Documenataion

# Frontend Documentation

This section of the project contains all the documentation you need to unders tand how the frontend is structured and how each part works including component, logic, routing, etc.

[![Client](https://img.shields.io/badge/Client-README-blue?style=for-the-badge)](/client/README.md)




# Backend Documentation

This section conatins the dcumenation of all the things used in the creation of the backend service along with their need and use.

[![Server](https://img.shields.io/badge/Server-README-blue?style=for-the-badge)](/server/README.md)


## Running the client

1. Go to the project directory

```
cd ".\client"
```

To be in the `client` repo.

2. Install dependencies

```
npm install
```

3. Run the application

```
npm run dev
```

This will run the application in `localhost:5173`.
If your port is already in use it will run at port `5174` but if you want to free it you need to get the process id for that process and kill that process. Use this in CMD.

---

### Client.env
<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>What it is</th>
      <th>How to get it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>VITE_CURRENCY</td>
      <td>Default currency symbol used in UI</td>
      <td>Define manually (e.g., ₹, $, €)</td>
    </tr>
    <tr>
      <td>VITE_CLERK_PUBLISHABLE_KEY</td>
      <td>Public authentication key (frontend safe)</td>
      <td>Create account on Clerk → Create app → Copy Publishable Key</td>
    </tr>
    <tr>
      <td>VITE_BASE_URL</td>
      <td>Base URL of backend server</td>
      <td>Use http://localhost:&lt;PORT&gt; or deployed backend URL</td>
    </tr>
    <tr>
      <td>VITE_TMDB_IMAGE_BASE_URL</td>
      <td>Base URL for movie images</td>
      <td>Use TMDB official image base URL</td>
    </tr>
  </tbody>
</table>

---

### Server.env
<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>What it is</th>
      <th>How to get it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PORT</td>
      <td>Port where backend server runs</td>
      <td>Choose any free port (e.g., 5000)</td>
    </tr>
    <tr>
      <td>MONGODB_URI</td>
      <td>MongoDB database connection string</td>
      <td>MongoDB Atlas → Create cluster → Connect → Copy URI</td>
    </tr>
    <tr>
      <td>CLERK_PUBLISHABLE_KEY</td>
      <td>Public key for authentication</td>
      <td>Clerk dashboard</td>
    </tr>
    <tr>
      <td>CLERK_SECRET_KEY</td>
      <td>Private backend authentication key</td>
      <td>Clerk dashboard → Backend keys</td>
    </tr>
    <tr>
      <td>INNGEST_EVENT_KEY</td>
      <td>API key for event workflows</td>
      <td>Inngest dashboard → Project settings</td>
    </tr>
    <tr>
      <td>INNGEST_SIGNING_KEY</td>
      <td>Webhook verification key</td>
      <td>Inngest dashboard</td>
    </tr>
    <tr>
      <td>TMDB_API_KEY</td>
      <td>API key for movie data</td>
      <td>TMDB account → API section</td>
    </tr>
    <tr>
      <td>STRIPE_PUBLISHABLE_KEY</td>
      <td>Public key for payments</td>
      <td>Stripe dashboard → API keys</td>
    </tr>
    <tr>
      <td>STRIPE_SECRET_KEY</td>
      <td>Private key for payments</td>
      <td>Stripe dashboard → Secret key</td>
    </tr>
    <tr>
      <td>STRIPE_WEBHOOK_SECRET</td>
      <td>Webhook verification secret</td>
      <td>Stripe → Webhooks → Create endpoint</td>
    </tr>
    <tr>
      <td>SENDER_EMAIL</td>
      <td>Email used to send system emails</td>
      <td>Your email (e.g., Gmail)</td>
    </tr>
    <tr>
      <td>SMTP_USER</td>
      <td>SMTP username</td>
      <td>Email provider (usually same as sender email)</td>
    </tr>
    <tr>
      <td>SMTP_PASS</td>
      <td>SMTP app password</td>
      <td>Generate from email provider (e.g., Gmail App Passwords)</td>
    </tr>
    <tr>
      <td>DATABASE_URL</td>
      <td>Primary database connection string (PostgreSQL)</td>
      <td>Supabase → Project → Database → Connection string</td>
    </tr>
    <tr>
      <td>DIRECT_URL</td>
      <td>Direct database connection (for migrations/tools)</td>
      <td>Supabase dashboard</td>
    </tr>
  </tbody>
</table>
---

### Terminate a Process

1. Find the process using specific port:

```
netstat -ano | findstr :5173
```

2. Terminate the process:

```
taskkill /PID 1245 /F
```

You will get a message that process is terminated, and to verify it again check which process is running at same port, if no output is there it means the process is successfully terminated.

---

#### Explanation:

1.  `netstat`:
    It shows all active network connections on your computer
    The output conatins:

        - Proto:

    Which shows the protocol used for the connection like TCP.

        - Local Address

    Your computer IP address and port number used for connection

        - Foreign Address

    The remote computer or server our computer connects to, along with the port number.

        - State

    It shows the staus of the connection, like "ESTABLISHED" when connection is active and data can be sent / received, "LISTENING" where a port on the computer is waiting for the incoming connections.

        `TCP [LOCAL_IP]:[LOCAL_PORT] [REMOTE_IP]:https ESTABLISHED`

2.  `netstat -a`:
    It shows all active connection and listening ports.
    Shows active TCP connections only.
    Provides: Protocol, Local Address, Foreign Address, State.

3.  `netstat -n`:
    It shows addresses and port number numerically.
    Shows connections numerically (IP addresses and port numbers) instead of resolving hostnames and services.
    Using "-n": ":https" -> ":443"

4.  `netstat -o`:
    Shows process ID (PID) of each process.

5.  `| findstr :5173`
    Filter the ouput to give the data only for port "5173".

6.  `taskkill`:
    Command to terminate a process.

7.  `/PID {PID}`:
    Specifies which process we want to kill.

8.  `/F`:
    Forces the process to terminate. Without `/F` the process might not terminate.

## Running the server

1. Go to the project directory

```
cd ".\server"
```

To be in the `server` repo.

2. Install dependencies

```
npm install
```

3. Run the application

```
node server.js
```

This will run the application in `localhost:3000`.
As that port is set by default.

---

<a href="https://greatstack.dev/p/quickshow" style="text-decoration:none;">
  <img src="https://img.shields.io/badge/Credits-GreatStack-ff6f61?style=for-the-badge">
</a>

> This project was created from following the GreatStack tutorial.
