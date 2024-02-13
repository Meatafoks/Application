import { Overrides, Extension, MetafoksApplication, runMetafoksApplication } from '../src';

describe('application can run', () => {
    const runFn = jest.fn();

    @Extension()
    @Overrides({ value: 1 })
    @MetafoksApplication
    class App {
        public start() {
            runFn();
        }
    }

    it('should run', async () => {
        await runMetafoksApplication(App);
        expect(runFn).toHaveBeenCalledTimes(1);
    });
});
