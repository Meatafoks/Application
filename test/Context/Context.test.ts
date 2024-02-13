import { MetafoksContext, MetafoksEvents } from '../../src';

describe('simple tests with context', () => {
    const handler = jest.fn();

    const events = new MetafoksEvents();
    events.on('componentRegistered', handler);

    const context = new MetafoksContext(events);

    it('should add alias', () => {
        // given
        const valueComponent = { name: 'Jean' };

        // when
        context.addValue('name', valueComponent);
        context.addAlias('test', 'name');

        // then
        expect(handler).toHaveBeenCalledTimes(2);

        expect(context.has('name')).toBeTruthy();
        expect(context.has('test')).toBeTruthy();

        expect(context.resolve('name')).toEqual(context.resolve('test'));
    });

    it('should track event', () => {
        // when
        context.trackComponentRegistration('some');

        // then
        expect(handler).toHaveBeenCalledWith('some');
    });
});
