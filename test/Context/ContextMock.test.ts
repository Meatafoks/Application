import { MetafoksContext, MetafoksEvents } from '../../src';

describe('mocks should block context registrations', () => {
    const context = new MetafoksContext(new MetafoksEvents());
    context.overrideProperties({ disableRegistrations: undefined });

    it('should block context', () => {
        // given
        const original = () => ({ result: 1 });
        const mock = { result: 2 };

        // when-0
        context.addFunction('test', original);
        const res0 = context.resolve('test');

        // then-0
        expect(res0).toEqual({ result: 1 });

        // when-1
        context.addMock('test', mock);
        const denied = [
            context.addClass('test', class {}),
            context.addFunction('test', function () {}),
            context.addValue('test', {}),
            context.addAlias('test', 'foo'),
        ];
        const res1 = context.resolve('test');

        // then-1
        expect(denied.every(v => v === false)).toBeTruthy();
        expect(res1).toEqual({ result: 2 });

        // when-2
        context.removeMock('test');
        context.addFunction('test', original);
        const res2 = context.resolve('test');

        // then-2
        expect(res2).toEqual({ result: 1 });
    });
});
