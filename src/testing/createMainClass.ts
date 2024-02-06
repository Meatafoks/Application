export const createMainClass = (onStart?: () => void) =>
    class {
        start() {
            onStart?.();
        }
    };
