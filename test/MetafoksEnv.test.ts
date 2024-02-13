import { MetafoksEnv } from '../src';

describe('MetafoksEnv tests', () => {
    it('should prioritize env', () => {
        process.env.CONFIG_PROFILE = '1';

        expect(MetafoksEnv.env('CONFIG_PROFILE', '2')).toEqual('1');
        expect(MetafoksEnv.env('CONFIG_PATH', 'zero')).toEqual('zero');
    });
});
