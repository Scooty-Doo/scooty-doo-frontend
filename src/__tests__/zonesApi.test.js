import * as api from '../api/zonesApi';  // Import the zones API
import fetchMock from 'jest-fetch-mock';  // Import jest-fetch-mock

fetchMock.enableMocks();  // Enable fetch mocks

beforeEach(() => {
    fetchMock.resetMocks();  // Reset mocks before each test
    global.sessionStorage = { getItem: jest.fn() };  // Mock sessionStorage if needed
});

describe('zonesApi', () => {

    describe('fetchZones', () => {
        it('should fetch zones successfully', async () => {
            // Mock a successful response
            const mockResponse = { data: ['zone1', 'zone2'] };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const result = await api.fetchZones();  // Call the API function

            expect(result).toEqual(mockResponse);  // Expect the result to match the mock response
            expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/v1/zones/', expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            }));
        });

        it('should throw an error if the API responds with an error (404)', async () => {
            // Simulate a 404 error from the API
            fetchMock.mockResponseOnce('', { status: 404 });

            await expect(api.fetchZones()).rejects.toThrowError('Failed to fetch zones: 404');  // Expect an error with the correct message
        });

        it('should throw an error if the fetch request fails (network error)', async () => {
            // Simulate a network error
            fetchMock.mockRejectOnce(new Error('Network error'));

            await expect(api.fetchZones()).rejects.toThrowError('Network error');
        });
    });

});
