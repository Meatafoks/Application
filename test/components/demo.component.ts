export default class DemoComponent {
    public constructor(private deps: { config: any }) {}

    public test() {
        return this.deps.config.value;
    }
}
