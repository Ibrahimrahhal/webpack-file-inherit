
export class MultiExtendError extends Error {
    constructor() {
        super("Can't Extend Multiple Files");
    }
}

export class MultiTerminateError extends Error {
    constructor() {
        super("Multiple Terminate Expressions Detected");
    }
}