import * as api from '../api/customerApi';  // Import the users API
import fetchMock from 'jest-fetch-mock';  // Import jest-fetch-mock

fetchMock.enableMocks();  // Enable fetch mocks

beforeEach(() => {
  fetchMock.resetMocks();  // Reset mocks before each test
  global.sessionStorage = { getItem: jest.fn() };  // Mock sessionStorage if needed
});

describe('usersApi', () => {

  describe('fetchCustomer', () => {
    it('should fetch customer successfully with search parameters', async () => {
      const mockResponse = { data: ['customer1', 'customer2'] };
      
      // Simulate a successful response with search parameters
      const name_search = 'John';
      const email_search = 'john@example.com';
      const github_login_search = 'john_github';
      
      const queryParams = new URLSearchParams({
        name_search,
        email_search,
        github_login_search,
      }).toString();
      
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await api.fetchCustomer({ name_search, email_search, github_login_search });
      
      expect(result).toEqual(mockResponse);  // Check the result
      expect(fetchMock).toHaveBeenCalledWith(`http://127.0.0.1:8000/v1/users/?${queryParams}`, expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }));
    });

    it('should fetch customer successfully with only name_search parameter', async () => {
      const mockResponse = { data: ['customer1'] };
      const name_search = 'John';
      
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await api.fetchCustomer({ name_search });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch customer successfully with only email_search parameter', async () => {
      const mockResponse = { data: ['customer2'] };
      const email_search = 'john@example.com';
      
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await api.fetchCustomer({ email_search });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch customer successfully with only github_login_search parameter', async () => {
      const mockResponse = { data: ['customer3'] };
      const github_login_search = 'john_github';
      
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await api.fetchCustomer({ github_login_search });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if API responds with an error (404)', async () => {
      // Simulate a 404 error from the API
      fetchMock.mockResponseOnce('', { status: 404 });

      await expect(api.fetchCustomer({ name_search: 'John' })).rejects.toThrowError('Failed to fetch user: 404');
    });

    it('should throw an error if the fetch request fails (network error)', async () => {
      // Simulate a network error
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(api.fetchCustomer({ name_search: 'John' })).rejects.toThrowError('Network error');
    });

  });

});
