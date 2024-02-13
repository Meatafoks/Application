import { ApplicationDecorator } from '../ApplicationDecorator';
import { MetafoksComponentsScanner, MetafoksComponentsScannerProperties } from '../../ComponentsScanner';
import { Context } from '../Context';
import { Configurator } from '../Configurator';

export const ComponentsScan: ApplicationDecorator = target => {
    Configurator(target);
    Context(target);

    if (!target.scanner) {
        target.scanner = new MetafoksComponentsScanner(target.context!);
        target.scanner.overrideProperties(target.configurator!.getConfig().scanner);
    }
};

export function ComponentsScanProperties(
    properties: Partial<MetafoksComponentsScannerProperties>,
): ApplicationDecorator {
    return target => {
        ComponentsScan(target);
        target.scanner!.overrideProperties(properties);
    };
}
