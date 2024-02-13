// import would be from @metafoks/app
import { createLogger, MetafoksApplication, With } from '../../../src';
import { botLikeExtension, BotLikeService } from '../../extension-base';

/**
 * botLikeExtension will inject to application
 * botLikeExtension has an autorun function (see source code) and it will run after all modules loaded
 *
 * To disable autorun you can use @DisableAutorun annotation: @DisableAutorun('me.creator.BotLikeExtension')
 */
@MetafoksApplication
@With(botLikeExtension)
export class App {
    private readonly logger = createLogger(App);

    public constructor(private deps: { botLikeService: BotLikeService }) {}

    async start() {
        const { botLikeService } = this.deps;
        botLikeService.getMessages();
    }
}
