import { createAbstractApplicationSync } from '../src';

describe('application can run', () => {
    const runFn = jest.fn();
    const app = createAbstractApplicationSync({
        onStart: runFn,
    });

    it('should run', () => {
        expect(runFn).toHaveBeenCalledTimes(1);
    });
});
