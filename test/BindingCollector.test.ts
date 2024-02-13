import { Bind, BindingValue, Component, MetafoksApplicationInstance, runMetafoksApplication } from '../src';
import { AbstractApplication } from './AbstractApplication';

describe('binding collector works', () => {
    MetafoksApplicationInstance.globalBindingCollector = AbstractApplication;

    @Component('some')
    class Some {
        @Bind()
        public name() {
            return 'Kate';
        }
    }

    it('should works properly', async () => {
        const container = await runMetafoksApplication(AbstractApplication);
        const name = container.context.resolve<BindingValue<string>>('name');

        expect(name()).toEqual('Kate');
    });
});
