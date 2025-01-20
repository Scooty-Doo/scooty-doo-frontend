// __tests__/api.test.js
import { fetchAdmin } from '../api/adminAccountApi';  // Adjust the path to your actual file

// Mocking sessionStorage
beforeEach(() => {
  sessionStorage.clear(); // Clear sessionStorage before each test
});

// Mock the global fetch function
global.fetch = jest.fn();

describe('fetchAdmin', () => {
  it('should fetch admin details successfully', async () => {
    // Mock the response
    const mockResponse = {
      data: {
        id: '1',
        attributes: {
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          github_login: 'johnDoe'
        }
      }
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Mock sessionStorage to contain a token
    sessionStorage.setItem('token', 'fake_token');

    const result = await fetchAdmin();

    // Check that the result matches the mock data
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/v1/admin/',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer fake_token',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should throw an error if there is no token in sessionStorage', async () => {
    sessionStorage.removeItem('token'); // Make sure there's no token

    await expect(fetchAdmin()).rejects.toThrow('Ingen token hittades i sessionStorage');
  });

  it('should throw an error if the response is not ok', async () => {
    // Mock sessionStorage to contain a token
    sessionStorage.setItem('token', 'fake_token');

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(fetchAdmin()).rejects.toThrow('Failed to fetch admin details: 500');
  });

  it('should handle network errors gracefully', async () => {
    // Mock sessionStorage to contain a token
    sessionStorage.setItem('token', 'fake_token');

    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchAdmin()).rejects.toThrow('Network error');
  });
});
