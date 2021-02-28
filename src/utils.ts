export const Patterns = {
    get extendRegex() {
        return new RegExp("@extends (\"|')[\\S]+?(\"|')", "g");
    },
    get blockHeaderRegex(){ 
        return new RegExp("@block (prepend ){0,1}(append ){0,1}[\\S]+", "g");
    },
    get blockHeaderNameExtractRegex() {
        return new RegExp("@block (prepend ){0,1}(append ){0,1}", "g");
    },
    get blockFooterRegex() {
        return new RegExp("@terminate block", "g");
    }
}