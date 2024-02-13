// import would be from @metafoks/app
import { BotLikeService } from './botLike.service';
import { ExtensionFactory } from '../../src';

/**
 * You can create your own extension for MetafoksApplication using this method
 * To add this extension, you should add @Extension or @With decorator to the main application
 */
export const botLikeExtension = ExtensionFactory.create({
    manifest: { identifier: 'me.creator.BotLikeExtension' },
    install: context => {
        context.addClass('botLikeService', BotLikeService);
    },
    autorun: context => {
        context.resolve<BotLikeService>('botLikeService').start();
    },
});
