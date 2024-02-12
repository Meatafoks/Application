import { asService, containerOf, Autowire, MetafoksApplication, Mock } from '../src';
import { MockAs } from '../src';

describe('testing mocks', () => {
    const runFn = jest.fn();

    const cmpFn1 = jest.fn();
    const cmpFn2 = jest.fn();
    const cmpFn3 = jest.fn();

    class TestService {
        public constructor(private deps: { someComponent1: any; someComponent2: any; someComponent3: any }) {}

        public test() {
            this.deps.someComponent1.run();
            this.deps.someComponent2.run();
            this.deps.someComponent3.run();
            runFn();
        }
    }

    @MetafoksApplication
    @Mock('someComponent1', { run: cmpFn1 })
    @Autowire('testService', asService(TestService))
    class App {
        private value = 3;
        constructor(private deps: { testService: TestService }) {}

        @MockAs('someComponent2')
        someMock = { run: cmpFn2 };

        @MockAs('someComponent3')
        someKek() {
            return { run: cmpFn3 };
        }

        public run() {
            this.deps.testService.test();
        }
    }

    it('should run', async () => {
        const _ = await containerOf(App);

        expect(cmpFn1).toHaveBeenCalledTimes(1);
        expect(cmpFn2).toHaveBeenCalledTimes(1);
        expect(cmpFn3).toHaveBeenCalledTimes(1);

        expect(runFn).toHaveBeenCalledTimes(1);
    });
});
