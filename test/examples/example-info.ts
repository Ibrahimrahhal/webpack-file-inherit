
export const FileExtendingExample = {
    content: `
        /* @extends './extendedBlock.ext' */
    `,
    after: `
        /*  */
    `,
    extending: './extendedBlock.ext'
};
export const FileNotExtendingExample = {
    content: `
        some text here & there
    `
};
export const FileMultiExtendingExample = {
    content: `
        some cool text
        /* @extends './extendedBlock.ext' */
        some text
        /* @extends './extendedBlock-2.ext' */
    `
};
