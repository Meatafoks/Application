import {
    ApplicationConstructor,
    Autowire,
    Context,
    Events,
    MetafoksContext,
    MetafoksEvents,
    Mock,
} from '../../src';

describe('test context decorators', () => {
    it('should has events', () => {
        // given
        @Events
        class App {}
        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.context).toBeUndefined();
        expect(target.events).toBeInstanceOf(MetafoksEvents);
    });

    it('should has events and context', () => {
        // given
        @Context
        class App {}
        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.context).toBeInstanceOf(MetafoksContext);
        expect(target.events).toBeInstanceOf(MetafoksEvents);
    });

    it('should has events, context and mock', () => {
        // given
        @Mock('some', { result: 'ok' })
        class App {}
        const target = App as ApplicationConstructor<App>;

        // when
        const obj = target.context!.resolve('some');

        // then
        expect(target.context).toBeInstanceOf(MetafoksContext);
        expect(target.events).toBeInstanceOf(MetafoksEvents);

        expect(obj).not.toBeUndefined();
        expect(obj.result).toBe('ok');
    });

    it('should autowire', () => {
        class A {
            public value = 1;
        }

        class B {
            public value = 2;
            public constructor(private deps: { a: A }) {}

            public getAPlusB() {
                return this.deps.a.value + this.value;
            }
        }

        // given
        @Autowire('a', A)
        @Autowire('b', B)
        class App {}
        const target = App as ApplicationConstructor<App>;

        // when
        const a = target.context!.resolve<A>('a');
        const b = target.context!.resolve<B>('b');
        const value = b.getAPlusB();

        // then
        expect(a).not.toBeUndefined();
        expect(b).not.toBeUndefined();

        expect(value).toBe(a.value + b.value);
        expect(value).toBe(3);
    });
});
