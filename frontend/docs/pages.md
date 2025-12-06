## User Pages

For routing to differnt pages for users including existing users and new users, the pages are divided into.
``` cs
src/
 └── pages/
       ├── Favorite/
       ├── Home/
       ├── Movie-Details/
       ├── Movies/
       ├── My-Bookings/
       ├── Seat-Layout/
       └── Admin/
            ├── Dashboard
            ├── Add-Shows
            ├── List-Bookings
            └── List-Shows
       
```

Now, each page can have any numbers of components as required.

On URL starting with `/admin` we first render a `<Layout/>` component which conatins the minimal things that are same in each component like NavBar, SideBar, and on the place where we render `<Outlet/>` components, other section are displayed there, like `Dashboard`, `Add-Shows`, etc.
