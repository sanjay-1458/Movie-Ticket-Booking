/* eslint-env jest */

import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { BrowserRouter } from "react-router-dom";
const mockUseUser = jest.fn();
const mockUseClerk = jest.fn(() => ({ openSignIn: jest.fn() }));

jest.mock("@clerk/clerk-react", () => ({
  useUser: () => mockUseUser(),
  useClerk: () => mockUseClerk(),
  UserButton: () => <div data-testid="user-button">UserMenu</div>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and login button when user is not logged in", () => {
    mockUseUser.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("shows UserButton when user is logged in", () => {
    mockUseUser.mockReturnValue({ user: { fullName: "Test User" } });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
