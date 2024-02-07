В Metafoks существует система расширений, которая производит внедрение зависимостей и может выполнять асинхронный
авто-запуск.

## Подключение расширений

Для подключения расширений используется аннотация `@Extension` или `@With`.

```ts
import { MetafoksApplication, With } from '@metafoks/app';
import { mongoDbExtension } from '@some-extension/mongodb';
import { telegramBotExtension } from '@some-extension/telegrambot';

@MetafoksApplication
@With( mongoDbExtension, telegramBotExtension )
export class Application {
}
```

## Создание расширения (гайд)

Напишем свое расширение, оно будет называться TelegramBot.
Для работы токена необходим токен, поэтому разработаем интерфейс конфигурации:

```ts
export interface TelegramBotConfiguration {
    token: string;
}
```

Далее, создадим сервис для бота:

```ts
export class BotService {
    public constructor(private deps: { config: TelegramBotConfiguration }) {}

    public async start() {
        const {config} = this.deps;
        const {token} = config;

        // realization here
    }
}
```

В файл `index.ts` добавим реализацию:

```ts
import { createExtension } from '@metafoks/app';

export const telegramBotExtension = createExtension( context => {
    context.addClass( 'bot', BotService );

    return {
        identifier: "me.test.TelegramBot",
        autorun: async () => {
            await context.resolve<BotService>( 'bot' ).start();
        }
    }
} );
```

Готово! Теперь наше расширение:

1) Реализует зависимость bot с типом BotService;
2) Выполняет запуск бота вместе с запуском приложения.

Чтобы подключить его в готовое приложение, используйте аннотацию `@Extension` или `@With`.