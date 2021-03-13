import FileController from "./file";
import * as chalk from 'chalk';

export class MultiExtendError extends Error {
    static message:string = "Can't Extend Multiple Files";
    constructor() {
        super(MultiExtendError.message);
                Object.setPrototypeOf(this, Object.create(MultiExtendError.prototype));

    }
}

export class MultiTerminateError extends Error {
    static message:string = "Multiple Terminate Expressions Detected";
    constructor() {
        super(MultiTerminateError.message);
        Object.setPrototypeOf(this, Object.create(MultiTerminateError.prototype));
    }
}

export const throwDescriptiveError = (error: any, file:FileController, content:string) => {
    let errorMessage = file.formattedLineVisual(content, true, false, (file) => {
        return chalk.red(`Extending Failded. Error In File ${file.path}\n${error.message}\n`);
    });
    console.error(errorMessage);
    throw new error();
}