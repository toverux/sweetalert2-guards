import * as index from '../src/index';

describe('index', () => {
    describe('Public exports', () => {
        it('should export expected symbols', () => {
            const keys = Object.keys(index);
            expect(keys).toEqual([
                'ErrorStrategy',
                'guard',
                'Alert', 'Confirm'
            ]);
        });
    });
});
