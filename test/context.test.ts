import { containerOf, EventListener, MetafoksTestingApplication, Reflection } from '../src';

describe('application can use context', () => {
    const registerFn = jest.fn();

    @MetafoksTestingApplication()
    @EventListener('componentRegistered', registerFn)
    class App {}

    it('should has items in context', async () => {
        // given
        const container = await containerOf(App);

        container.context.addClass('testService', TestService);
        container.context.addClass('secondService', SecondService);

        // when
        const reflection = container.context.resolve<Reflection>('reflection');
        const result = container.context.resolve<SecondService>('secondService').secondTest();

        // then
        expect(reflection.has('secondService')).toBeTruthy();
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
