import FileController from "./file";
import * as chalk from 'chalk';

export class MultiExtendError extends Error {
    static message = "Can't Extend Multiple Files";
    constructor() {
        super(MultiExtendError.message);
        Object.setPrototypeOf(this, Object.create(MultiExtendError.prototype));

    }
}

export class MultiTerminateError extends Error {
    static message = "Multiple Terminate Expressions Detected";
    constructor() {
        super(MultiTerminateError.message);
        Object.setPrototypeOf(this, Object.create(MultiTerminateError.prototype));
    }
}

export const throwDescriptiveError = (error: { new(): Error, message: string }, file:FileController, content:string): string => {
    const errorMessage = file.formattedLineVisual(content, true, false, (file) => {
        return chalk.red(`Extending Failded. Error In File ${file.path}\n${error.message}\n`);
    });
    console.error(errorMessage);
    throw new error();
}