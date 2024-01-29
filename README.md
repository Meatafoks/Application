# Metafoks Application

Inspired by Spring

## How to use

Create `index.ts` file with content:

```typescript
// file: index.ts

import { MetafoksApplication, createLogger } from "@metafoks/app";
import MyService from './my.service.ts';

@MetafoksApplication()
class Application {
    private logger = createLogger( Application );

    constructor(private deps: { config: any, myService: MyService }) {}

    start() {
        // Start point of your application
        this.logger.info( this.deps.config );
        this.deps.myService.startService();
    }
}
```

Now, lets create the first service. You should call it like `*.service.ts`, place it whenever you want in src folder.
Your service has to be exported with `default` keyword.

```typescript
// file: my.service.ts

export default class MyService {
    private logger = createLogger( MyService );

    constructor(private deps: { config: any }) {}

    startService() {
        this.logger.info( "service has been started!" );
    }
}
```

## Custom components

If you want to create non-service component, use `*.component.ts` files.
Component has to be exported as `deafault` same.

```typescript
// file: db.component.ts

export default class DbComponent {
}
```

But what if you want to resolve your component by shorter name? We have a solution!

```typescript
// file: db.component.ts

import { Component } from "@mtafoks/app";

@Component( "db" )
export default class DbComponent {
}
```

Since now, you can resolve it by `db` name.

```typescript
// file: index.ts

import { MetafoksApplication, createLogger } from "@metafoks/app";
import DbComponent from './db.component.ts';

@MetafoksApplication()
class Application {
    private logger = createLogger( Application );

    constructor(private deps: { config: any, db: DbComponent }) {}

    async start() {
        // Start point of your application
        this.logger.info( this.deps.config );
        await this.deps.db.connect();
    }
}
```

## Loaders

Metafoks application has `loaders` - functions that calls once as singleton, but has a context too.
Let's create `telegraf.loader.ts`.

```typescript
// file: telegraf.loader.ts

export default function (deps: { config: any }) {
    return new Telegraf( config.token );
}
```

And now we can create telegram loader as well.

```typescript
// file: telegram.loader.ts

export default function (deps: { telegraf: Telegraf }) {
    return telegraf.telegram;
}
```

Well, what about resolving name? Simply without 'loader'.

```typescript
// file: bot.component.ts

import { Component } from "@metafoks/app";

@Component( "bot" )
export default class BotComponent {
    public constructor(private deps: { telegraf: Telegraf, telegram: Telegram, config: any }) {}
}
```

## Custom extensions

```typescript
import { MetafoksContext } from "@metafoks/app";

MetafoksContext.getContext()
```

`getContext()` function returns context of the application.

Simple extension:

```typescript
// module: @custom/tg
// file: index.ts

import { MetafoksContext } from "@metafoks/app";

export class TelegramBot {
    public constructor(private deps: {}) {}

    startBot() {}
}

export function telegramBotExtension(context: MetafoksContext) {
    context.addClass( "telegramBot", TelegramBot );
}
```

```typescript
// file: index.ts

// ...imports

@MetafoksApplication( {
    with: [telegramBotExtension]
} )
class Application {
    private logger = createLogger( Application );

    constructor(private deps: { config: any, telegramBot: TelegramBot }) {}

    start() {
        // Start point of your application
        this.logger.info( this.deps.config );
        this.deps.telegramBot.startBot();
    }
}
```
