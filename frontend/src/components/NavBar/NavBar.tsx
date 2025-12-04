import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { assets } from "../../assets/assets.ts";
import { BookAIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="QuickShow Logo" className="w-36 h-auto" />
      </Link>

      <div
        className={`
           max-md:fixed max-md:top-0 max-md:left-0 
          max-md:w-full max-md:h-screen
          max-md:bg-black/80 backdrop-blur 
          max-md:flex max-md:flex-col
          max-md:items-center max-md:justify-center
          transform transition-transform duration-300
          z-50
          md:flex md:flex-row md:static
          md:rounded-full md:bg-white/10 md:border border-gray-300/20
          gap-8 md:px-8 py-3
          ${isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => {
            setIsOpen(false);
          }}
        />
        <Link
          to="/"
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Home
        </Link>
        <Link
          to="/movies"
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Movies
        </Link>
        <Link
          to="/theatres"
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Theatres
        </Link>
        <Link
          to="/releases"
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Releases
        </Link>
        <Link
          to="/favorite"
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Favorites
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {!user ? (
          <button
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
            onClick={() => openSignIn()}
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<BookAIcon width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      />
    </div>
  );
}

export default NavBar;
