import {
    MetafoksExtensionsProperties,
    MetafoksExtensionsPropertiesAutorun,
} from './MetafoksExtensionsProperties';
import { createLogger } from '../utils';
import { merge } from '../utils/merge';
import { ExtensionContainer } from './Factory';
import { MetafoksEvents } from '../Events0';

export class MetafoksExtensions {
    private readonly logger = createLogger(MetafoksExtensions);

    public readonly extensionsIdentifiersMap: Record<string, ExtensionContainer> = {};

    public properties: MetafoksExtensionsProperties = {
        enabled: true,
        autorun: { disabled: [] },
    };

    public constructor(private readonly events: MetafoksEvents) {
        this.logger.info('started extensions loader');
    }

    public getAutorunDisabledExtensionsIdentifiers() {
        if (typeof this.properties.autorun.disabled !== 'boolean') {
            return this.properties.autorun.disabled;
        }
        return [];
    }

    public isAutorunEnabled() {
        return this.properties.autorun.disabled !== true;
    }

    public isAutorunEnabledFor(extensionIdentifier: string) {
        if (!this.isAutorunEnabled()) return false;
        return !this.getAutorunDisabledExtensionsIdentifiers().includes(extensionIdentifier);
    }

    public overrideProperties(properties?: Partial<MetafoksExtensionsProperties>) {
        if (properties) {
            this.properties = merge.withOptions(
                { mergeArrays: false },
                this.properties,
                properties,
            ) as MetafoksExtensionsProperties;
            this.logger.info(`properties changed=${JSON.stringify(properties)}`);
        }
    }

    public disableAutorun(value: string | string[] | boolean) {
        if (typeof value === 'boolean') {
            return this.overrideAutorunProperties({ disabled: value });
        }

        const normalizedValue = value instanceof Array ? value : [value];
        const prevValue = this.properties.autorun.disabled;

        if (typeof prevValue === 'boolean') this.overrideAutorunProperties({ disabled: normalizedValue });
        else this.overrideAutorunProperties({ disabled: [...prevValue, ...normalizedValue] });
    }

    public overrideAutorunProperties(properties?: Partial<MetafoksExtensionsPropertiesAutorun>) {
        this.properties.autorun = merge(
            this.properties.autorun,
            properties ?? {},
        ) as MetafoksExtensionsPropertiesAutorun;
        this.logger.info(`autorun properties changed=${JSON.stringify(properties)}`);
    }

    public add(...extensions: ExtensionContainer[]) {
        extensions.forEach(value => {
            this.extensionsIdentifiersMap[value.manifest.identifier] = value;
        });
        this.logger.info(`added extensions count=${extensions.length}`);
    }

    public remove(...extensions: ExtensionContainer[]) {
        extensions.forEach(value => {
            delete this.extensionsIdentifiersMap[value.manifest.identifier];
        });
        this.logger.info(`removed extensions count=${extensions.length}`);
    }
}
