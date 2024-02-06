import { ActiveProfile, Extension, MetafoksApplication } from '../../src';
import { testExtension } from '../extensions/testExtension';

@MetafoksApplication
@ActiveProfile('dev')
@Extension(testExtension)
export class Application {
    public constructor(private deps: { config: any }) {}

    async start() {
        console.log(this.deps.config.key);
    }
}
