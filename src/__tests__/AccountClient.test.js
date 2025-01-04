/* eslint-env jest */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountClient from "../pages/customer/AccountClient"; // Anpassa sökvägen
import "@testing-library/jest-dom"; // För matcher som `toBeInTheDocument`

describe("AccountClient", () => {
    test("renders the AccountClient and display the user info", () => {
        render(<AccountClient />);

        // Kontrollera att standardvärdena visas
        expect(screen.getByDisplayValue("Maya Edlund")).toBeInTheDocument();
        expect(screen.getByDisplayValue("maya@example.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Testgatan 1, 12345 Teststad")).toBeInTheDocument();
        expect(screen.getByDisplayValue("0701234567")).toBeInTheDocument();
        expect(screen.getByText("513 :-")).toBeInTheDocument();
    });

    test("updates user info when input changes", () => {
        render(<AccountClient />);

        // Simulera inputförändringar
        const nameInput = screen.getByDisplayValue("Maya Edlund");
        fireEvent.change(nameInput, { target: { value: "Anna Andersson" } });

        // Kontrollera att värdet uppdateras
        expect(screen.getByDisplayValue("Anna Andersson")).toBeInTheDocument();
    });

    test("shows alert and logs updated info on form submission", () => {
        render(<AccountClient />);

        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
        const consoleLogMock = jest.spyOn(console, "log").mockImplementation(() => {});

        // Fyll i formuläret och skicka det
        fireEvent.submit(screen.getByRole("button", { name: "Spara ändringar" }));

        // Kontrollera att alert visas och att info loggas
        expect(alertMock).toHaveBeenCalledWith("Dina ändringar har sparats!");
        expect(consoleLogMock).toHaveBeenCalledWith("Uppdaterade användardetaljer:", {
            name: "Maya Edlund",
            email: "maya@example.com",
            address: "Testgatan 1, 12345 Teststad",
            phone: "0701234567",
            wallet: 513,
        });

        alertMock.mockRestore();
        consoleLogMock.mockRestore();
    });
});
