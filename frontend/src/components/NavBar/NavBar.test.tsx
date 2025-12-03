import { vi } from "vitest";
import { beforeEach, describe, it, expect } from "vitest";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

vi.mock("lucide-react", () => {
  return {
    MenuIcon: (props: { onClick: React.MouseEventHandler<HTMLElement> }) => (
      <div {...props}>MENU</div>
    ),
    XIcon: (props: { onClick: React.MouseEventHandler<HTMLElement> }) => (
      <div {...props}>XIcon</div>
    ),
    SearchIcon: () => <div />,
    BookAIcon: () => <div />,
  };
});

vi.mock("react-router", () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => {
      return <a>{children}</a>;
    },
    useNavigate: vi.fn(),
  };
});

vi.mock("@clerk/clerk-react", () => {
  const UserButton = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-btn">{children}</div>
  );
  UserButton.MenuItems = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="menu-items">{children}</div>
  );
  UserButton.Action = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }) => (
    <button onClick={onClick} data-testid="menu-action">
      {label}
    </button>
  );
  return {
    UserButton,
    useClerk: vi.fn(),
    useUser: vi.fn(),
  };
});

describe("Testing NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClerk).mockReturnValue({
      openSignIn: vi.fn(),
    } as unknown as ReturnType<typeof useClerk>);
    vi.mocked(useUser).mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false,
    });
  });

  it("should display login button when user is not logged in", () => {
    render(<NavBar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
  it("should display UserButton when logged in and nagigation to my-bookings works", async () => {
    const mockNaviagte = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNaviagte);

    vi.mocked(useUser).mockReturnValue({
      user: { id: "user" },
    } as unknown as ReturnType<typeof useUser>);

    render(<NavBar />);

    const userBtn = await screen.findByTestId("user-btn");
    expect(userBtn).toBeInTheDocument();

    fireEvent.click(userBtn);

    const myBookings = await screen.findByText("My Bookings");

    expect(myBookings).toBeInTheDocument();

    fireEvent.click(screen.getByText("My Bookings"));
    expect(mockNaviagte).toHaveBeenCalledWith("/my-bookings");
  });
});
