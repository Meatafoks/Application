import { MetafoksContext, MetafoksEvents } from '../../src';

describe('context add component tests', () => {
    const context = new MetafoksContext(new MetafoksEvents());

    const addClassSpy = jest.spyOn(context, 'addClass');
    const addFunctionSpy = jest.spyOn(context, 'addFunction');
    const addValueSpy = jest.spyOn(context, 'addValue');

    const classComponent = class {
        test() {
            return { result: 'class' };
        }
    };

    const functionComponent = function () {
        return { result: 'fn' };
    };

    const valueComponent = { result: 'value' };

    it('should add any components as it should be', () => {
        // when
        context.addComponent('class', classComponent);
        context.addComponent('func', functionComponent);
        context.addComponent('val', valueComponent);

        //then
        const classResolved = context.resolve<typeof classComponent.prototype>('class');
        const funcResolved = context.resolve<ReturnType<typeof functionComponent>>('func');
        const valueResolved = context.resolve<typeof valueComponent>('val');

        expect(addClassSpy).toHaveBeenCalledWith('class', classComponent);
        expect(addFunctionSpy).toHaveBeenCalledWith('func', functionComponent);
        expect(addValueSpy).toHaveBeenCalledWith('val', valueComponent);

        expect(classResolved.test()).toEqual({ result: 'class' });
        expect(funcResolved).toEqual({ result: 'fn' });
        expect(valueResolved).toEqual({ result: 'value' });
    });
});
