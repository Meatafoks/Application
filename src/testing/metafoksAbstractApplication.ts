import { MetafoksContext } from '../context';
import { MetafoksAppConfig } from '../config';
import { RunMetafoksApplicationOptions } from '../context/runMetafoksApplication';
import { registerLoggerFactory } from '../registers/logger.register';

export class MetafoksAbstractApplication {
    public static async createInstant<TConfig = any>(
        props: { config?: TConfig & MetafoksAppConfig } & RunMetafoksApplicationOptions = {},
    ) {
        const context = new MetafoksContext();
        context.addValue('config', props.config);

        registerLoggerFactory(context, { disableFileWriting: true });

        for (const extension of props.with ?? []) {
            await extension(context);
        }

        return new MetafoksAbstractApplication(context);
    }

    private constructor(private readonly context: MetafoksContext) {}

    public getContext() {
        return this.context;
    }

    public mock<TMock = any>(name: string, mock: TMock) {
        this.getContext().addValue(name, mock);
    }

    public resolve<T = any>(name: string) {
        return this.getContext().resolve<T>(name);
    }
}
