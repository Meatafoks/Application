import { Bind, BindingValue, Extend, runMetafoksApplication, Component, Binding, Autowire } from '../src';
import { AbstractApplication } from './AbstractApplication';

describe('binding configuration', () => {
    @Component('binding')
    class BindingConfig {
        @Bind()
        public name() {
            return 'i am';
        }

        @Bind()
        public lastName() {
            return 'sam';
        }
    }

    @Binding(BindingConfig)
    @Autowire(BindingConfig)
    @Extend(AbstractApplication)
    class App {
        public constructor(private deps: { name: BindingValue<string>; lastName: BindingValue<string> }) {}

        public test() {
            return this.deps.name() + ' ' + this.deps.lastName();
        }
    }

    it('should contains bindings', async () => {
        const container = await runMetafoksApplication(App);
        const app = container.context.resolve<App>('app');

        expect(app.test()).toEqual('i am sam');
    });
});
