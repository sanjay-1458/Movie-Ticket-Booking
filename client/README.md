# Frontend Documentation

This section of the project contains all the documentation you need to understand how the frontend is structured and how each part works including component, logic, routing, etc.

---

## Documentation Overview

### 🔹 MISC

**File:** `docs/ui.md` [Link](docs/misc.md)<br>
This document covers all the UI used apart from components.

---

### 🔹 Pages

**File:** `docs/pages.md` [Link](docs/pages.md)<br>
This conatins the page-level structures: how pages are organized, how layouts work, and how each page ties into routing and the overall UI.

---

### 🔹 Clerk

**File:** `docs/clerk-account-handler.md` [Link](docs/clerk-account-handler.md)<br>
How clerk is used for login / sign-in.

---


### 🔹 Role

**File:** `docs/role-based-control.md` [Link](docs/role-based-control.md)<br>
Seperate normal users from admin.

--

### 🔹 Components

**File:** `docs/components.md` [Link](docs/components.md)<br>
This contains all the component used in the application with their usage.

---

### 🔹 Notification

**File:** `docs/notification.md` [Link](docs/notification.md)<br>
Everything related to the global notification system it trigger messages, the different notification types, and styling.

---

### 🔹 Implementation

**File:** `docs/implementation.md` [Link](docs/implementation.md)<br>
This is the in-depth document of how the app interact among componet level and logic implementation. It walks through the internal logic, patterns, API handeling and overall architecture of the frontend.

---

### 🔹 Product Design

**File:** `docs/product-design.md` [Link](docs/product-design.md)<br>
This contains what the product is supposed to do, how user interacts and features available.

---

## Running the Frontend

1. Go to the project directory

``` js
cd ".\frontend"
```

To be in the `frontend` repo.

2. Install dependencies

``` js
npm install
```

3. Run the application

``` js
npm run dev
```

This will run the application in `localhost:5173`.
If your port is already in use it will run at port `5174` but if you want to free it you need to get the process id for that process and kill that process. Use this in CMD.

---

### Terminate a Process

1. Find the process using specific port:

``` js
netstat -ano | findstr :5173
```

2. Terminate the process:

``` js
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
