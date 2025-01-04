/* eslint-env jest */
import { parsePath, formatTime } from '../components/utils.js';

describe('Utility Functions', () => {
    describe('parsePath', () => {
        it('should convert WKT ', () => {
            const pathWKT = 'LINESTRING (30 10, 10 30, 40 40)';
            const result = parsePath(pathWKT);
      
            expect(result).toEqual([
                [10, 30],  // lat, lng order
                [30, 10],
                [40, 40]
            ]);
        });
    });

    describe('formatTime', () => {
        it('should format ISO string to HH.MM format', () => {
            const isoString = '2024-12-22T14:45:00';
            const result = formatTime(isoString);

            expect(result).toBe('14.45');
        });
    });
});
