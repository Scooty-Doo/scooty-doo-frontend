import * as api from '../api/bikeApi';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
    global.sessionStorage = { getItem: jest.fn() };
});

describe('API functions', () => {
  
    describe('fetchBikes', () => {
        it('should fetch bikes successfully', async () => {
            sessionStorage.setItem('token', 'valid-token');
            const mockResponse = { data: ['bike1', 'bike2'] };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
      
            const result = await api.fetchBikes();
          
            expect(result).toEqual(mockResponse);
            expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/v1/bikes/', expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            }));
        });
      
        it('should throw an error if no token is found', async () => {
            sessionStorage.removeItem('token');
          
            await expect(api.fetchBikes()).rejects.toThrowError('Ingen token hittades i sessionStorage');
        });
      
        it('should throw an error on failed API response', async () => {
            // Set a valid token in sessionStorage to avoid the token error
            sessionStorage.setItem('token', 'valid-token');
          
            fetchMock.mockResponseOnce('', { status: 500 });
      
            await expect(api.fetchBikes()).rejects.toThrowError('Failed to fetch bikes: 500');
        });
    });
      

    describe('fetchAvailableBikes', () => {
        it('should fetch available bikes successfully', async () => {
            // Set a valid token in sessionStorage
            sessionStorage.setItem('token', 'valid-token');
    
            const mockResponse = { available: ['bike1', 'bike2'] };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const result = await api.fetchAvailableBikes();
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if API response fails', async () => {
            sessionStorage.setItem('token', 'valid-token');
            fetchMock.mockResponseOnce('', { status: 404 }); // Simulate a 404 failure

            await expect(api.fetchAvailableBikes()).rejects.toThrowError('Failed to fetch bikes: 404');
        });

        it('should throw an error if no token is found', async () => {
            // Simulate the absence of the token in sessionStorage
            sessionStorage.removeItem('token');
    
            await expect(api.fetchAvailableBikes()).rejects.toThrowError('Ingen token hittades i sessionStorage');
        });

        it('should throw an error if the API request fails', async () => {
            // Set a valid token in sessionStorage
            sessionStorage.setItem('token', 'valid-token');
    
            fetchMock.mockRejectOnce(new Error('Failed to fetch available bikes'));
    
            await expect(api.fetchAvailableBikes()).rejects.toThrowError('Failed to fetch available bikes');
        });
    });


    describe('fetchBike', () => {
        it('should fetch bike details successfully', async () => {
            const mockResponse = { id: 1, details: 'Bike Details' };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const result = await api.fetchBike(1);
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if API response fails', async () => {
            sessionStorage.setItem('token', 'valid-token');
            fetchMock.mockResponseOnce('', { status: 500 }); // Simulate a failed response

            await expect(api.fetchBike()).rejects.toThrowError('Failed to fetch bike: 500');
        });

        it('should throw an error when the fetch fails', async () => {
            fetchMock.mockRejectOnce(new Error('Failed to fetch bike'));

            await expect(api.fetchBike(1)).rejects.toThrowError('Failed to fetch bike');
        });
    });

    describe('fetchBikeByCityApi', () => {
        it('should fetch bikes by cityId successfully', async () => {
            const mockResponse = { bikes: ['bike1', 'bike2'] };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const result = await api.fetchBikeByCityApi(101);
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if API response fails', async () => {
            sessionStorage.setItem('token', 'valid-token');
            fetchMock.mockResponseOnce('', { status: 500 }); // Simulate a failed response

            await expect(api.fetchBikeByCityApi()).rejects.toThrowError('Failed to fetch bike by cityId: 500');
        });

        it('should throw an error on failure', async () => {
            fetchMock.mockRejectOnce(new Error('Failed to fetch bike by cityId'));

            await expect(api.fetchBikeByCityApi(101)).rejects.toThrowError('Failed to fetch bike by cityId');
        });
    });

    describe('bikeDetails', () => {
        it('should update bike details successfully', async () => {
            const mockResponse = { success: true };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const result = await api.bikeDetails(1, 50, 2, 'position1', true);
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error when the update fails', async () => {
            fetchMock.mockRejectOnce(new Error('Failed to update bike details'));

            await expect(api.bikeDetails(1, 50, 2, 'position1', true)).rejects.toThrowError('Failed to update bike details');
        });
    });

    describe('fetchBikesInZone', () => {
        it('should fetch bikes in zone successfully', async () => {
        // Set a valid token in sessionStorage
            sessionStorage.setItem('token', 'valid-token');
        
            const mockResponse = { bikes: ['bike1', 'bike2'] };
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
    
            const result = await api.fetchBikesInZone(1, 101);
            expect(result).toEqual(mockResponse);
        });
  
        it('should throw an error when no token is found', async () => {
            // Simulate the absence of the token in sessionStorage
            sessionStorage.removeItem('token');
      
            await expect(api.fetchBikesInZone(1, 101)).rejects.toThrowError('Ingen token hittades i sessionStorage');
        });
  
        it('should throw an error when the fetch fails', async () => {
            // Simulate a valid token
            sessionStorage.setItem('token', 'valid-token');
      
            fetchMock.mockRejectOnce(new Error('Failed to fetch bikes in zone'));
  
            await expect(api.fetchBikesInZone(1, 101)).rejects.toThrowError('Failed to fetch bikes in zone');
        });
    });
  

});
