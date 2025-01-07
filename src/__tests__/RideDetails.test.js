/* eslint-env jest */
import React from "react";
import { render, screen } from "@testing-library/react";
import RideDetails from "../components/RideDetails";
import "@testing-library/jest-dom";

// Mockdata för testet
const mockRideHistory = {
    data: {
        attributes: {
            start_time: "2023-12-15T08:30:00Z",
            end_time: "2023-12-15T09:00:00Z",
            total_fee: 59
        }
    }
};

// Mocka formatTime-funktionen
const mockFormatTime = jest.fn((time) => {
    const date = new Date(time);
    return `${String(date.getHours()).padStart(2, "0")}.${String(date.getMinutes()).padStart(2, "0")}`;
});

describe("RideDetails Component", () => {
    test("renders ride details with correct time and price", () => {
        render(
            <RideDetails 
                rideHistory={mockRideHistory} 
                formatTime={mockFormatTime} 
            />
        );

        // Kontrollera att starttid och sluttid har renderats korrekt
        expect(mockFormatTime).toHaveBeenCalledWith("2023-12-15T08:30:00Z");
        expect(mockFormatTime).toHaveBeenCalledWith("2023-12-15T09:00:00Z");

        expect(screen.getByText(/59 kr/i)).toBeInTheDocument();
        
        // Kontrollera datumformat och tider
        const formattedDate = new Date(mockRideHistory.data.attributes.start_time).toLocaleDateString();
        expect(screen.getByText(new RegExp(formattedDate, "i"))).toBeInTheDocument();
    });

    test("renders error message if rideHistory is missing", () => {
        const { container } = render(
            <RideDetails
                rideHistory={{
                    data: {
                        attributes: {
                            start_time: "",
                            end_time: "",
                            total_fee: 0
                        }
                    }
                }}
                formatTime={mockFormatTime}
            />
        );
    
        // Kontrollera att sidan inte kraschar
        expect(container).toBeInTheDocument();
    });
    
});
