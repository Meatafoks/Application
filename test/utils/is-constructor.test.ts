import { isConstructor, isFunctionReturning } from '../../src';

describe('test if constructor', () => {
    it('should be a constructor', () => {
        class Test {}
        const target = Test;

        expect(isConstructor(target)).toBeTruthy();
        expect(isFunctionReturning(target)).toBeFalsy();
    });

    it('should be a function returning', () => {
        const target = function () {
            return {};
        };

        expect(isConstructor(target)).toBeFalsy();
        expect(isFunctionReturning(target)).toBeTruthy();
    });
});
