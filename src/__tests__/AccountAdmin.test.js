import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountAdmin from "../pages/admin/AccountAdmin";
import { fetchAdmin } from "../api/adminAccountApi";

// Mock the fetchAdmin function
jest.mock("../api/adminAccountApi", () => ({
  fetchAdmin: jest.fn(),
}));

describe("AccountAdmin", () => {
  const mockAdminData = {
    data: {
      attributes: {
        full_name: "John Doe",
        email: "john.doe@example.com",
        github_login: "johndoe",
        created_at: "2022-01-01",
        updated_at: "2022-01-01",
      },
      id: "12345",
      links: {
        self: "/admin/12345",
      },
    },
  };

  beforeEach(() => {
    fetchAdmin.mockResolvedValue(mockAdminData); // Mock the resolved data from the API
  });

  test("renders the form with admin data", async () => {
    render(<AccountAdmin />);

    // Wait for the form to be populated with fetched admin data
    await waitFor(() => expect(fetchAdmin).toHaveBeenCalled());

    // Check if the fields are populated with the fetched data
    expect(screen.getByLabelText(/Användarnamn/)).toHaveValue(mockAdminData.data.attributes.full_name);
    expect(screen.getByLabelText(/E-postadress/)).toHaveValue(mockAdminData.data.attributes.email);
    expect(screen.getByLabelText(/Github Login/)).toHaveValue(mockAdminData.data.attributes.github_login);
    expect(screen.getByLabelText(/Id/)).toHaveValue(mockAdminData.data.id);
    expect(screen.getByLabelText(/Self/)).toHaveValue(mockAdminData.data.links.self);
  });

  test("handles form submission with validation errors", async () => {
    render(<AccountAdmin />);

    // Wait for the form to be populated with fetched admin data
    await waitFor(() => expect(fetchAdmin).toHaveBeenCalled());

    // Fill the form with invalid data (empty fields to trigger validation errors)
    fireEvent.change(screen.getByLabelText(/Användarnamn/), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/E-postadress/), { target: { value: "" } });

    // Submit the form
    fireEvent.click(screen.getByText(/Spara ändringar/));

    // Check if validation error messages appear
    expect(await screen.findByText(/Användarnamn krävs/)).toBeInTheDocument();
    expect(await screen.findByText(/E-postadress krävs/)).toBeInTheDocument();
  });

  test("handles valid form submission", async () => {
    render(<AccountAdmin />);

    // Wait for the form to be populated with fetched admin data
    // await waitFor(() => expect(fetchAdmin).toHaveBeenCalled());

    // Fill the form with valid data
    fireEvent.change(screen.getByLabelText(/Användarnamn/), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText(/E-postadress/), { target: { value: "jane.doe@example.com" } });

    // Mock the global alert function to check if it's called
    global.alert = jest.fn();

    // Submit the form
    fireEvent.click(screen.getByText(/Spara ändringar/));

    // Check if the alert function was called
    expect(global.alert).toHaveBeenCalledWith("Ändringar sparade!");
  });

  test("handles API fetch errors", async () => {
    // Make fetchAdmin mock reject with an error
    fetchAdmin.mockRejectedValueOnce(new Error("Failed to fetch admin details"));

    render(<AccountAdmin />);

    // Wait for the form to be populated with fetched admin data
    await waitFor(() => expect(fetchAdmin).toHaveBeenCalled());

    // Check if the error was logged (optional)
    // This part is to ensure the error handling part of the useEffect works
    // You could also mock console.error if you want to check if it logs the error correctly
  });
});
