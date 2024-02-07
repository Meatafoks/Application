# Компоненты

Основная философия metafoks ходит вокруг двух типов компонентов:

- Компоненты - классы компонентов
- Загрузчики - функциональные компоненты

## Компоненты

Компоненты или классовые компоненты - одна из двух базовых элементов приложения metafoks.

Пример классового компонента:

```typescript
export default class UsersDataComponent {

    public constructor(private deps: {
        dbComponent: DatabaseComponent;
        config: Config;
    }) {}
}
```

**Здесь важно заметить, что компоненты экспортируются как `default`!**

Такой компонент будет доступен в контексте как `usersDataComponent`. Однако, можно упростить имя компонента,
используя аннотацию [`@Component`](annotations.md#аннотации-компонентов)

```typescript
import { Component } from "@metafoks/app";

@Component( "usersData" )
export class UsersDataComponent {

    public constructor(private deps: {
        dbComponent: DatabaseComponent;
        config: Config;
    }) {}
}
```

Первое - теперь нет необходимости использовать `default` экспорты, а второе - компонент будет доступен в контексте
как `usersData`.

Во-избежание проблем во время рефакторинга рекомендуется всегда использовать
аннотацию [`@Component`](annotations.md#аннотации-компонентов).
Таким образом, за конкретным компонентом будет закреплено его имя в контексте, независимо от реального имени объекта.

## Загрузчики

Загрузчик - это простейший функциональный компонент, который также может использовать контекст.

```typescript
// file: usersCollection.loader.ts
export default function (props: { dbComponent: DatabaseComponent, config: Config }) {
    const {dbComponent, config} = props;
    return dbComponent.getCollection( config.usersCollectionName );
};
```

Такой компонент будет доступен в системе как `usersCollection`. В данном случае, имя компонента используется как имя
файла, но с удалением постфикса `.loader`.

Аннотации классовых компонентов в таком случае не доступны.