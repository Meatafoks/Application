import { MetafoksAppConfig } from '../../config';
import { merge } from '../../utils/merge';
import { MetafoksContext } from '../metafoksContext';
import { createLogger } from '../../utils';
import { MetafoksEnv } from '../env/metafoksEnv';
import path from 'path';
import fs from 'fs';

/**
 * Configures metafoks application
 */
export class MetafoksConfigurator {
    private readonly logger = createLogger(MetafoksConfigurator);

    private profile = MetafoksEnv.env('CONFIG_PROFILE');
    private overrides: Partial<MetafoksAppConfig> = {};
    private configPath = MetafoksEnv.env('CONFIG_PATH', 'config');

    public constructor(private context: MetafoksContext) {}

    /**
     * Sets application profile
     *
     * Profiles causes to configuration file name.
     * Example: when profile `dev`, it will load `config.dev.json` file.
     *
     * @param profile - active profile or undefined
     */
    public setProfile(profile?: string) {
        this.profile = profile;
    }

    /**
     * Sets the configurations path
     * The path where config files places
     *
     * @param path - path
     */
    public setConfigPath(path: string) {
        this.configPath = path;
    }

    /**
     * Sets the overrides config values
     * This values will override config file values, use @Override annotation.
     *
     * @param config
     */
    public configureOverrides(config: MetafoksAppConfig) {
        this.overrides = merge(this.overrides, config);
    }

    /**
     * Sets the disabled autorun
     * Disabled extensions will not use autorun function
     *
     * @param value - true/false or array, or single extension identifier
     */
    public configureDisableAutorun(value: string[] | string | boolean) {
        if (typeof value === 'boolean') {
            this.configureOverrides({ loader: { autorun: { disabled: value } } });
        } else {
            const items = value instanceof Array ? value : [value];
            this.configureOverrides({ loader: { autorun: { disabled: items } } });
        }
    }

    /**
     * Configure application to context
     *
     * 1. Loads file
     * 2. Merges configuration file with overrides
     * 3. Loads it to context
     *
     */
    public configure(): MetafoksAppConfig {
        this.logger.debug(`starting application configuration with profile=${this.profile}`);

        const configFromFile = this.getConfigFileContent();
        const configuration = merge(configFromFile, this.overrides);
        this.context.addValue('config', configuration);

        this.logger.info(`loaded config with profile=${this.profile ?? 'DEFAULT'}`);
        this.logger.trace(configuration);

        return configuration;
    }

    private getResolvedConfigPath() {
        return path.resolve(this.configPath);
    }

    private getConfigFileName() {
        if (this.profile) return `config.${this.profile.toLowerCase()}.json`;
        return 'config.json';
    }

    private getResolvedConfigFilePath() {
        return path.resolve(this.getResolvedConfigPath() + '/' + this.getConfigFileName());
    }

    private isConfigFileExists() {
        return fs.existsSync(this.getResolvedConfigFilePath());
    }

    private getConfigFileContent() {
        const configPath = this.getResolvedConfigFilePath();
        if (!this.isConfigFileExists()) {
            this.logger.warn(`config file is undefined at path: ${configPath}`);
            return {};
        }

        const configContent = String(fs.readFileSync(configPath, { encoding: 'utf8' }));
        return JSON.parse(configContent);
    }
}
