export const Patterns = {
    extendRegex: /@extends ("|')[-a-zA-Z0-9.\/ ]*("|')/g,
    blockHeaderRegex: /@block (prepend ){0,1}(append ){0,1}[$a-zA-Z0-9]*/g,
    blockHeaderNameExtractRegex: /@block (prepend ){0,1}(append ){0,1}/g,
    blockFooterRegex: /@terminal block/
}