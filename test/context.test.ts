import { createAbstractApplication } from '../src';

describe('application can use context', () => {
    it('should has items in context', () => {
        // given

        const registerFn = jest.fn();
        const app = createAbstractApplication({
            config: {
                loaderLoggerLevel: 'trace',
                overrides: { metafoks: { logger: { level: { system: 'debug' } } } },
            },
            events: { onComponentRegistered: registerFn },
        });

        app.getContext().addClass('testService', TestService);
        app.getContext().addClass('secondService', SecondService);

        // when
        const result = app.resolve<SecondService>('secondService').secondTest();

        // then
        expect(registerFn).toHaveBeenCalledWith('testService');
        expect(registerFn).toHaveBeenCalledWith('secondService');
        expect(registerFn).toHaveBeenCalledWith('config');

        expect(result).toEqual('bar');
    });
});

class TestService {
    constructor(private deps: { config: any }) {}

    public test() {
        return this.deps.config.foo;
    }
}

class SecondService {
    constructor(private deps: { testService: TestService }) {}

    public secondTest() {
        return this.deps.testService.test();
    }
}
