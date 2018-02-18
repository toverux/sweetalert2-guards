import { makeDecorator, normalizeDecoratorArguments } from '../src/decorator_factory';
import { SweetAlertOptions } from '../src/decorator_runtime';

describe('decorator_factory', () => {
    describe(normalizeDecoratorArguments.name, () => {
        it('should convert simple options', () => {
            const options = normalizeDecoratorArguments(['title', 'text'])();

            expect(options.title).toEqual('title');
            expect(options.text).toEqual('text');
        });

        it('should convert simple options, followed by additional object options', () => {
            const options = normalizeDecoratorArguments(['title', 'text', { type: 'info' }])();
            const optionsWithThunk = normalizeDecoratorArguments(['title', 'text', () => ({ type: 'info' })])();

            expect(options.type).toEqual('info');
            expect(optionsWithThunk.type).toEqual('info');
        });

        it('should convert object options alone', () => {
            const options = normalizeDecoratorArguments([{ title: 'title' }])();
            const optionsWithThunk = normalizeDecoratorArguments([() => ({ title: 'title' })])();

            expect(options.title).toEqual('title');
            expect(optionsWithThunk.title).toEqual('title');
        });

        it('should merge user options with decorator\'s defaults', () => {
            const defaults: SweetAlertOptions = { title: 'decoratorTitle', type: 'info' };

            const options = normalizeDecoratorArguments(['title', 'text'], defaults)();
            const objOptions = normalizeDecoratorArguments([{ title: 'title' }], defaults)();
            const objOptionsWithThunk = normalizeDecoratorArguments([() => ({ title: 'title' })], defaults)();

            expect(options.title).toEqual('title');
            expect(options.type).toEqual('info');

            expect(objOptions.title).toEqual('title');
            expect(objOptions.type).toEqual('info');

            expect(objOptionsWithThunk.title).toEqual('title');
            expect(objOptionsWithThunk.type).toEqual('info');
        });

        it('should pass the wrapped method\'s arguments to thunkified options', () => {
            function getOptions(title: string) {
                return { title: 'my ' + title };
            }

            const options1 = normalizeDecoratorArguments([getOptions])('title');
            const options2 = normalizeDecoratorArguments(['overriden', 'text', getOptions])('title');

            expect(options1.title).toEqual('my title');
            expect(options2.title).toEqual('my title');
        });

        it('should throw when an incorrect number of arguments is passed', () => {
            expect(() => normalizeDecoratorArguments([])).toThrow();
            expect(() => normalizeDecoratorArguments(['', '', '', ''])).toThrow();
        });
    });

    describe(makeDecorator.name, () => {
        // declaring as "any" to test its behaviour on other targets than methods
        const decorator: any = () => makeDecorator(decorator, () => ({}));

        it('should refuse to decorate anything other than class methods', () => {
            expect(() => {
                @decorator()
                // @ts-ignore
                class TestClass { }
            }).toThrow(/cannot decorate class TestClass/i);

            expect(() => {
                // @ts-ignore
                class TestClass {
                    @decorator()
                    public property: any;
                }
            }).toThrow(/cannot decorate property TestClass\.property/i);

            expect(() => {
                // @ts-ignore
                class TestClass {
                    @decorator() public get test() { return 'value'; }
                }
            }).toThrow(/cannot decorate setter or getter TestClass\.test/i);

            expect(() => {
                // @ts-ignore
                class TestClass {
                    @decorator() public set test(value: string) { }
                }
            }).toThrow(/cannot decorate setter or getter TestClass\.test/i);

            expect(() => {
                // @ts-ignore
                class TestClass {
                    public test(@decorator() parameter: string) { }
                }
            }).toThrow(/cannot decorate parameter #0 of TestClass\.test/i);

            expect(() => {
                decorator()();
            }).toThrow(/cannot decorate \[unknown target type]/i);
        });

        it('should be able to decorate a method', () => {
            // @ts-ignore
            class TestClass {
                @decorator() public test() { }
            }
        });
    });
});
