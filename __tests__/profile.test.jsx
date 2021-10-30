import Profile from "../components/profile/user-profile";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";

jest.mock("next-auth/client");

describe("Profile", () => {
  it("renders correctly when signed in", () => {
    useSession.mockReturnValueOnce([
      {
        user: {
          email: "foo@bar.com",
        },
      },
      false,
    ]);

    render(<Profile />);
    expect(screen.getByText("Personal Information"));
  });
});
