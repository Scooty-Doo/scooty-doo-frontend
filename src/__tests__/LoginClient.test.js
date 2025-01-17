/* eslint-env jest */
import React from "react";
import { render, screen } from "@testing-library/react";
import LoginClient from "../pages/customer/LoginClient";
import "@testing-library/jest-dom";

// Mock environmental variables
process.env.REACT_APP_GITHUB_CLIENT_DEV = "devClientId";
process.env.REACT_APP_GITHUB_CLIENT = "prodClientId";

describe("LoginClient Component", () => {
    const basename = "/app";

    beforeEach(() => {
        document.body.className = ""; // Clear body classes before each test
    });

    test("renders LoginClient correctly", () => {
        render(<LoginClient basename={basename} />);

        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("GitHub")).toBeInTheDocument();
        expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    test("adds and removes body class on mount/unmount", () => {
        const { unmount } = render(<LoginClient basename={basename} />);

        // Check that the class is added
        expect(document.body.classList.contains("loginBody")).toBe(true);

        // Check that the class is removed on unmount
        unmount();
        expect(document.body.classList.contains("loginBody")).toBe(false);
    });

});
