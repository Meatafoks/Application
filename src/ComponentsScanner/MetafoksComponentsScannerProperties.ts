export interface MetafoksComponentsScannerProperties {
    enabled: boolean;
    componentsGlob: string | string[];
    loadersGlob: string | string[];
    exclude: string | string[];
}
