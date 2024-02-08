import { containerOf, MetafoksApplication } from '../src';

describe('application can run', () => {
    const runFn = jest.fn();

    @MetafoksApplication
    class App {
        public run() {
            runFn();
        }
    }

    it('should run', async () => {
        const _ = await containerOf(App);
        expect(runFn).toHaveBeenCalledTimes(1);
    });
});
