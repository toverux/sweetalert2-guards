import DummyClass from '../src';

describe('Dummy test', () => {
    it('DummyClass is instantiable', () => {
        expect(new DummyClass()).toBeInstanceOf(DummyClass);
    });
});
