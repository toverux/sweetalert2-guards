import { createGuardMethod } from '../src/decorator_runtime';

describe('decorator_runtime', () => {
    describe(createGuardMethod.name, () => {
        it('should give a wrapper function that calls the wrapped one with the same arguments', async () => {
            const wrapped = jest.fn();
            const wrapper = createGuardMethod(wrapped, () => ({}));

            await wrapper(1, 2, 3);

            expect(wrapped).toHaveBeenCalledWith(1, 2, 3);
        });
    });
});
