import { MetafoksEnvKey } from './keys';

export class MetafoksEnv {
    public static env<T = string>(name: MetafoksEnvKey, defaultValue: T): T;
    public static env<T = string>(name: MetafoksEnvKey): T | undefined;
    public static env<T = string>(
        name: MetafoksEnvKey,
        defaultValue: T | undefined = undefined,
    ): T | undefined {
        return (process.env[name] as T | undefined) ?? defaultValue;
    }

    public static set(name: MetafoksEnvKey, value: string) {
        process.env[name] = value;
    }
}
