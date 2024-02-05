import { createAbstractApplication } from '../src';

describe('application can run', () => {
    const runFn = jest.fn();
    const app = createAbstractApplication({
        events: { onStarted: runFn },
        config: { loaderLoggerLevel: 'trace' },
    });

    it('should run', () => {
        expect(runFn).toHaveBeenCalledTimes(1);
    });
});
