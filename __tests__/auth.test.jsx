import Layout from "../components/layout/layout";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";

jest.mock("next-auth/client");

describe("Layout", () => {
  it("renders correctly when signed out", () => {
    useSession.mockReturnValueOnce([false, false]);

    render(<Layout />);
    expect(screen.getByText("Login"));
  });

  it("renders correctly when signed in", () => {
    useSession.mockReturnValueOnce([
      {
        user: {
          email: "foo@bar.com",
        },
      },
      false,
    ]);

    render(<Layout />);
    expect(screen.getByText("Profile"));
    expect(screen.getByText("Logout"));
  });
});
