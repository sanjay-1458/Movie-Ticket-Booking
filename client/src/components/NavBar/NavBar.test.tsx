import { vi, beforeEach, describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../context/AppContext.tsx";
import NavBar from "./NavBar";

vi.mock("../../context/AppContext.tsx", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  MenuIcon: (props: any) => <div {...props}>MENU</div>,
  XIcon: (props: any) => <div {...props}>XIcon</div>,
  SearchIcon: (props: any) => <div {...props} />,
  BookAIcon: (props: any) => <div {...props} />,
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, onClick }: any) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
  useNavigate: vi.fn(),
}));

vi.mock("@clerk/clerk-react", () => {
  const UserButtonMock: any = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-btn">{children}</div>
  );

  UserButtonMock.MenuItems = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="menu-items">{children}</div>
  );

  UserButtonMock.Action = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: any;
  }) => (
    <button onClick={onClick} data-testid="menu-action">
      {label}
    </button>
  );

  return {
    UserButton: UserButtonMock,
    useClerk: vi.fn(),
    useUser: vi.fn(),
  };
});

describe("Testing NavBar Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppContext).mockReturnValue({
      favoriteMovies: [],
      axios: { get: vi.fn(), post: vi.fn() },
      fetchIsAdmin: vi.fn(),
      getToken: vi.fn(),
      navigate: mockNavigate,
      currency: "$",
    } as any);

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useClerk).mockReturnValue({
      openSignIn: vi.fn(),
    } as any);

    vi.mocked(useUser).mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false,
    } as any);
  });

  it("should display login button when user is not logged in", () => {
    render(<NavBar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("should show Favorites link when favoriteMovies is not empty", () => {
    vi.mocked(useAppContext).mockReturnValue({
      favoriteMovies: [{ id: 1, title: "Inception" } as any],
    } as any);

    render(<NavBar />);
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("should display UserButton when logged in and navigation to my-bookings works", async () => {
    vi.mocked(useUser).mockReturnValue({
      user: { id: "user_123", fullName: "user" },
      isLoaded: true,
      isSignedIn: true,
    } as any);

    render(<NavBar />);

    const userBtn = screen.getByTestId("user-btn");
    expect(userBtn).toBeInTheDocument();

    const myBookingsAction = screen.getByTestId("menu-action");
    expect(myBookingsAction).toHaveTextContent("My Bookings");

    fireEvent.click(myBookingsAction);
    expect(mockNavigate).toHaveBeenCalledWith("/my-bookings");
  });

  it("should open mobile menu when MenuIcon is clicked", () => {
    render(<NavBar />);

    const menuBtn = screen.getByText("MENU");
    fireEvent.click(menuBtn);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
