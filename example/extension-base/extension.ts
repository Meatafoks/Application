// import would be from @metafoks/app
import { createExtension } from '../../src';
import { BotLikeService } from './botLike.service';

/**
 * You can create your own extension for MetafoksApplication using this method
 * To add this extension, you should add @Extension or @With decorator to the main application
 */
export const botLikeExtension = createExtension(context => {
    context.addClass('botLikeService', BotLikeService);

    return {
        identifier: 'me.creator.BotLikeExtension',
        autorun: () => {
            context.resolve<BotLikeService>('botLikeService').start();
        },
    };
});
