import { containerOf, Bind, EventListener, MetafoksTestingApplication, Overrides } from '../src';

interface Config {
    data: 10;
}

describe('functional components realization', () => {
    const testComponentSpyFn = jest.fn();

    @MetafoksTestingApplication<Config>({ config: { data: 10 } })
    class Application {
        value = 123;

        public constructor(private deps: { config: Config }) {}

        @Bind('testComponent')
        testComponent() {
            testComponentSpyFn();
            return this.value + this.deps.config.data;
        }
    }

    it('should calls functional component with it context', async () => {
        const container = await containerOf(Application);

        const hasAspect = container.context.has('testComponent');
        expect(hasAspect).toBeTruthy();

        const testComponent = container.context.resolve<() => number>('testComponent');
        const result = testComponent();

        expect(result).toEqual(133);
    });
});
