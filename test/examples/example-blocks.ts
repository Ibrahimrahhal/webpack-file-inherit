export const FileWithOneBlock = `
    some text
    /* @block blockName */
    this is block content
    /* @terminate block */
    some text afterwards
`;

export const FileWithMultiBlock = `
    some text
    /* @block blockName */
    this is block content
    /* @terminate block */
    some text afterwards
    /* @block blockName2 */
    this is block content
    /* @terminate block */
    some text here maybe
    /* @block blockName3 */
    this is block content
    /* @terminate block */
    finall text
`;