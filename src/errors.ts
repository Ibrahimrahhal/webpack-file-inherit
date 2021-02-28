
export class MultiExtendError extends Error {
    constructor(message?: string) {
        super("Can't Extend Multiple Files");
    }
}

export class MultiTerminateError extends Error {
    constructor(message?: string) {
        super("Multiple Terminate Expressions Detected");
    }
}