# Overview

Additonal to th ticket booking functionality, it runs unit test cases on the important components like `Trailers` to verify that video is being played with the expected source, and `Navbar` for Clerk authentications.

![Test](https://github.com/sanjay-1458/Movie-Ticket-Booking/actions/workflows/react-unit-tests.yml/badge.svg)


## Client

The frontend is created using React as it allow us to break the UI into multiple resuable components, and it uses a virtual DOM to effeciently update the real DOM. It calculates the difference in new virtual DOM and old virtual DOM after every render using the diffing algorithm to find the minimum number of chnages and applies that to real DOM using reconciliation precess.

Now the entry point for rendering the application is created using `React.createRoot()` and use `render` method to render the main `<App/>` inside the `root`.

```
<div id = "root"> </div>

React.createRoot(documemt.getElementById('root').render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
))
```

We use `React.StrictMode` to render the component twice in development phase only as it invokes the lifecycle methods twice for detecting bugs like syde effects, cleanup. It does not affect in production.

### Dependencies

```
react-router-dom -> For navigation
lucide-react -> For icons
react-hot-toast -> For notification
react-player -> To play the videos
```


### Pages

The application is divided into normal and admin pages. For normal pages which are avilable to everyone the pages are 
```
Home Page
Details Page
Seat Selection Page
My Bookings
```

### Routing

`BrowserRouter` is used to keep the UI sync with the URL.
`Routes` it is a container to wrap all the routes.
`Route` it maps the path with the component which will be render for this URL.
`Link` it is used to navigate to another route withour reloading the page, it updates the URL.

`useLocation` is a hook that allow us to access the current URL. It reaturns an object including: 

```
{
  pathname: "/home",
  search: "?q=,
  hash: "",
  key: "default"
  state: null
}

```
If the current URL is `/about?q=react#section1` then `pathname: "/about"`,  `search: "?q=react"`, and `hash: "#section1"`

```
function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}
```

### Login / Logout

Clerk can be used for authentication and user management in React application, we can use google and phone number signin method.

After setting up the login page in Clerk we get the `PUBLISHABLE_KEY`, to import or use in the application we use the syntax `import.meta.env.VIT_VARIABLE_NAME` but only fetches the variable with `VITE` prefix as we have created React application using Vite.

```
<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
</ClerkProvider>
```

We have also added `Mu Bookings` option inside the user profile dashboard option using Clerk, which will navigate user to their bookings.

```
<UserButton>
    <UserButton.MenuItems>
        <UserButton.Action
        label="My Bookings"
        labelIcon={<TicketPlus />}
        width={14}

        onClick={() => navigate("/my-bookings")}
        />
    </UserButton.MenuItems>
</UserButton>
```

### Blur Circle

A Blur Circle is added to multiple parts of the application so a component is created which will place the absolute circle based on the props.
```
function BlurCircle({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
}) {
  return (
    <div
      className="absolute -z-50 h-58 w-58 bg-primary/30 blur-3xl rounded-full aspect-square"
      style={{
        top: top,
        left: left,
        bottom: bottom,
        right: right,
      }}
    ></div>
  );
}

export default BlurCircle;
```