import { MetafoksContext } from '../context';
import { MetafoksAppConfig } from '../config';

export class MetafoksAbstractApplication {
    public static createInstant<TConfig = any>(props: { config: TConfig & MetafoksAppConfig }) {
        const context = new MetafoksContext();
        context.addValue('config', props.config);

        return new MetafoksAbstractApplication(context);
    }

    private constructor(private context: MetafoksContext) {}

    public mock<TMock = any>(name: string, mock: TMock) {
        this.context.addValue(name, mock);
    }

    public async addExtension(extension: (context: MetafoksContext) => void | Promise<void>) {
        await extension(this.getContext());
    }

    public getContext() {
        return this.context;
    }
}
