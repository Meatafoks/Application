// import would be from @metafoks/app
import { createLogger, Service } from '../../src';

import { BotLikeConfig } from './config';

@Service('botLikeService')
export class BotLikeService {
    private readonly logger = createLogger(BotLikeService);
    public constructor(private deps: { config: BotLikeConfig }) {}

    public start() {
        const { config } = this.deps;
        this.logger.info(`bot started with token=${config.token}`);
    }

    public getMessages() {
        // something to do
        this.logger.info('wow, i am a bot!');
    }
}
