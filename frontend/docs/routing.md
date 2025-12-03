## BrowserRouter

`BrowserRouter` is a component from React Router that enables client-side routing in your React application.

It listen to the brwser URL, and based on the path it renders the correct component. It also uses the HTML5 history API so that we can move forward, backward in the application, and with no full page refresh.

``` js
<BrowserRouter>
    <App />
</BrowserRouter>
```

## Routes

<Routes> is a React Router component that contains all your route definitions.
Without <Routes>, <Route> tags won’t work.

## Route

<Route> tag tells the browsers when we are at a certain URL render this particular component.

``` js
<Route path = "/" element = {<Home/>}>
```

If URL is "/" than render "Home" component.

``` js
"/movies/avengers"
"/movies/prometheus"
```

In this type of routing when the parammeter is dynamic we use colon (":") and the page remains same but data get chnaged with respect to the parameters.

Anything that starts with a colon (:) is a URL parameter.

We can further extends the movie with seclected movie than date:

``` js
/movies/5/2024-02-01
/movies/10/2024-03-03
```

``` js
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movies" element={<Movies />} />
    <Route path="/movies/:id" element={<MovieDetails />} />
    <Route path="/movies/:id/:date" element={<SeatLayout />} />
    <Route path="/my-bookings" element={<MyBookings />} />
    <Route path="/favorite" element={<Favorite />} />
</Routes>
```

Also we can fetch which movie or time was selected based on URL.

## useParams()

`useParams()` is a React Router hook that lets you read dynamic URL parameters like ":id", ":date", ":userId", etc.`

It returns an object will the URL parameter data.

We can fetch the dynamic URL parameter using useParam, by comparing it with the existing URL route.

For this route `<Route path="/movies/:id/:date" element={<SeatLayout />} />` we can fetch the "id" and "date" as `const { id, date } = useParams();`

## useLoaction()

It is another react hook but instead of just fetching the dynamic parametrs, it fetches entire URL and we can see the "pathName", "query parameters", etc.

useLocation() returns an object that describes the current URL.

``` js
{
  pathname: "/movies/12",
  search: "?date=2024-02-01",
  hash: "",
  state: { from: "homepage" }
}
```

It can be used to check whether we are at "/admin" or not.

``` js
const isAdminRoute = useLocation().pathname.startsWith("/admin");
```

Usage: NavBar is not displayed for Admin

``` js
{!isAdminRoute && <NavBar />}
```

## Link

`<Link>` is React Router’s replacement for `<a>` tags when navigating inside a React app.

Case:

1. `<a href = "/movies"></a>` → reloads the whole page (full browser reload)

2. `<Link to="/movies">` → changes the URL and renders the new component without reloading (client-side routing)

`<Link to="/">Home</Link>`

## useNaviagte()

With `useNavigate`, you can move the user to another route programmatically, such as after clicking a button, submitting a form, or running some logic.

``` js
const handleLogin = () => {
   // do login logic...
   navigate("/dashboard"); // redirect after login
};
```