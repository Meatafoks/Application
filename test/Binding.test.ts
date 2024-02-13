import { Bind, Binding, Component, Extend, Override, runMetafoksApplication } from '../src';
import { AbstractApplication } from './AbstractApplication';

interface Config {
    data: number;
}

describe('functional components realization', () => {
    const testComponentSpyFn = jest.fn();

    @Component('binds')
    class BindsComponent {
        value = 123;

        public constructor(private deps: { config: Config }) {}

        @Bind('testComponent')
        testComponent() {
            testComponentSpyFn();
            return this.value + this.deps.config.data;
        }
    }

    @Binding(BindsComponent)
    @Override({ data: 10 })
    @Extend(AbstractApplication)
    class App {}

    it('should calls functional component with it context', async () => {
        const container = await runMetafoksApplication(App);

        const hasBinding = container.context.has('testComponent');
        expect(hasBinding).toBeTruthy();

        const testComponent = container.context.resolve<() => number>('testComponent');
        const result = testComponent();

        expect(testComponentSpyFn).toHaveBeenCalled();
        expect(result).toEqual(133);
    });
});
