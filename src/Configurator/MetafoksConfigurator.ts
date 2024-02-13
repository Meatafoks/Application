import { MetafoksAppConfig } from '../config';
import { createLogger } from '../utils';
import { merge } from '../utils/merge';
import { MetafoksConfiguratorProperties } from './MetafoksConfiguratorProperties';
import * as path from 'path';
import * as fs from 'fs';
import { MetafoksEnv } from '../Enviropment';

export class MetafoksConfigurator {
    private readonly logger = createLogger(MetafoksConfigurator);
    private config: MetafoksAppConfig = {};

    public properties: MetafoksConfiguratorProperties = {
        profile: MetafoksEnv.env('CONFIG_PROFILE'),
        configPath: MetafoksEnv.env('CONFIG_PATH', 'config'),
    };

    public constructor() {
        this.logger.info('configurator started');
        this.overrideConfig(this.getConfigurationFileContent());
    }

    public getConfig<T = {}>(): T & MetafoksAppConfig {
        return this.config as T & MetafoksAppConfig;
    }

    /**
     * Overrides default config values
     * @param data
     */
    public overrideConfig<T>(data?: Partial<T>) {
        this.config = merge(this.config, data ?? {});
    }

    public overrideProperties(properties?: Partial<MetafoksConfiguratorProperties>) {
        if (properties) {
            this.properties = merge.withOptions(
                { mergeArrays: false },
                this.properties,
                properties,
            ) as MetafoksConfiguratorProperties;
            this.overrideConfig(this.getConfigurationFileContent());
            this.logger.info(`properties changed=${JSON.stringify(properties)}`);
        }
    }

    private getConfigurationPath() {
        return path.resolve(this.properties.configPath);
    }

    private getConfigurationFileName() {
        if (this.properties.profile) return `config.${this.properties.profile}.json`;
        return 'config.json';
    }

    private getConfigurationFilePath() {
        return path.resolve(this.getConfigurationPath() + '/' + this.getConfigurationFileName());
    }

    private getConfigurationFileContent() {
        const configurationFilePath = this.getConfigurationFilePath();
        if (!fs.existsSync(configurationFilePath)) {
            this.logger.warn(`configuration file is undefined: '${configurationFilePath}'!`);
            return {};
        }

        try {
            const content = String(fs.readFileSync(configurationFilePath));
            return JSON.parse(content);
        } catch (e) {
            this.logger.warn(`configuration file (${configurationFilePath}) error: ${e}`);
            return {};
        }
    }
}
