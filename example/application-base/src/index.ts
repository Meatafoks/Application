// import would be from @metafoks/app
import { MetafoksApplication, createLogger } from '../../../src';

interface Config {
    hello: string;
}

@MetafoksApplication
export class App {
    private readonly logger = createLogger(MetafoksApplication);

    public constructor(private deps: { config: Config }) {}

    async start() {
        const { config } = this.deps;

        // it would be 'world' from config/config.json
        // you can change config file with @ActiveProfile( profile ) annotation
        this.logger.info(config.hello);
    }
}
