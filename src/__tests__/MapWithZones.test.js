import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MapWithZones from "../components/MapDrawZones";
import "@testing-library/jest-dom";

// Mock React Leaflet och dess komponenter
jest.mock("react-leaflet", () => ({
    MapContainer: jest.fn(({ children }) => <div data-testid="map-container">{children}</div>),
    TileLayer: jest.fn(() => <div data-testid="tile-layer" />),
    FeatureGroup: jest.fn(({ children }) => <div data-testid="feature-group">{children}</div>),
    Polygon: jest.fn(({ positions, color, eventHandlers }) => (
        <div
            data-testid="polygon"
            style={{ backgroundColor: color }}
            onClick={eventHandlers?.click}
        >
            {JSON.stringify(positions)}
        </div>
    )),
}));

const parseBoundary = (boundary) => {
    if (!boundary || typeof boundary !== "string") {
        console.error("Invalid boundary:", boundary);
        return [];
    }

    return boundary
        .replace("POLYGON((", "")
        .replace("))", "")
        .split(",")
        .map((coord) => {
            const [lng, lat] = coord.trim().split(" ").map(parseFloat);
            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid coordinate in boundary:", coord);
                return null;
            }
            return [lat, lng];
        })
        .filter((coord) => coord !== null); 
};

// Mock React Leaflet Draw
jest.mock("react-leaflet-draw", () => ({
    EditControl: jest.fn(() => <div data-testid="edit-control" />),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: async () => ({ data: [] }),
    })
);
 
describe("MapWithZones Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("displays form inputs and handles input changes", () => {
        render(<MapWithZones />);

        const zoneNameInput = screen.getByPlaceholderText("Enter Zone Name");
        const cityIdInput = screen.getByPlaceholderText("Enter City ID");
        const zoneTypeSelect = screen.getByLabelText("Select Zone Type:");

        fireEvent.change(zoneNameInput, { target: { value: "Test Zone" } });
        fireEvent.change(cityIdInput, { target: { value: 2 } });
        fireEvent.change(zoneTypeSelect, { target: { value: 3 } });

        expect(zoneNameInput.value).toBe("Test Zone");
        expect(cityIdInput.value).toBe("2");
        expect(zoneTypeSelect.value).toBe("3");
    });

    test("saves a new zone with valid data", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: {
                    id: 1,
                    attributes: {
                        zone_name: "Test Zone",
                        boundary: "POLYGON((13 55, 14 56, 13 55))",
                        zone_type_id: 1,
                        city_id: 1,
                    },
                },
            }),
        });

        render(<MapWithZones />);

        fireEvent.change(screen.getByPlaceholderText("Enter Zone Name"), {
            target: { value: "Test Zone" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter City ID"), {
            target: { value: 1 },
        });

        const saveButton = screen.getByText("Save Zone");
        fireEvent.click(saveButton);

        await waitFor(() =>
            expect(fetch).toHaveBeenCalledWith("http://localhost:8000/v1/zones/", expect.any(Object))
        );
    });

    test('initial state is correct', () => {
        render(<MapWithZones />);
        const { getByLabelText } = screen;
      
        // Check initial state for form fields
        expect(getByLabelText('Select Zone Type:').value).toBe('1');
        expect(getByLabelText('Zone Name:').value).toBe('');
        expect(getByLabelText('City ID:').value).toBe('1');
      });

      test('fetches and loads zones correctly', async () => {
        const mockFetch = jest.spyOn(global, 'fetch');
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: [
              { id: 1, attributes: { boundary: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))', zone_name: 'Zone A', zone_type_id: 1, city_id: 1 } },
            ],
          }),
        });
      
        render(<MapWithZones />);
        
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledTimes(1);
        });
      });

      test('correctly parses boundary string', () => {
        const boundary = 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))';
        const result = parseBoundary(boundary);
        expect(result).toEqual([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]);
      });

});
