export const Patterns = {
    get extendRegex():RegExp {
        return new RegExp("@extends (\"|')[\\S]+?(\"|')", "g");
    },
    get blockHeaderRegex():RegExp { 
        return new RegExp("@block (prepend ){0,1}(append ){0,1}[\\S]+", "g");
    },
    get blockHeaderNameExtractRegex():RegExp {
        return new RegExp("@block (prepend ){0,1}(append ){0,1}", "g");
    },
    get blockFooterRegex():RegExp {
        return new RegExp("@terminate block", "g");
    }
}