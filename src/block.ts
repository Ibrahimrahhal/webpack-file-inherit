import { Patterns } from './utils';
const fs = require('fs');

class Block {
    type:string;
    name:string;
    content:string;
    constructor(t:string, n:string, c:string) {
        this.type = t;
        this.name = n;
        this.content = c;
    }
}
class ExtendInfo {
    isExtending:boolean;
    extendedFile:string;
    fileModifiedContent:string;
    errors:string[];
    constructor() {
        this.isExtending = false;
        this.extendedFile = '';
        this.fileModifiedContent = '';
        this.errors = [];
    }
}

export class BlockController {
    static getExtendingInfo(fileContent:string){
        var extendingInfo = new ExtendInfo();
    
        if(!Patterns.extendRegex.test(fileContent)) {
            extendingInfo.isExtending = false;
            extendingInfo.fileModifiedContent = fileContent;
            return extendingInfo;
        }
        var extendDirectives = fileContent.match(Patterns.extendRegex);
    
        if(extendDirectives.length > 1) {
            extendingInfo.errors.push("hi");
            return extendingInfo;
        }
    
        extendingInfo.isExtending = true;
        extendingInfo.fileModifiedContent = fileContent.replace(Patterns.extendRegex, "");
        extendingInfo.extendedFile = extendDirectives[0].replace(/@extends +/g, "").replace(/('|"| )/g, "");
        return extendingInfo;
    }

    static ConvertToBlocks(fileContent:string):Block[][] {
        var info = this.getExtendingInfo(fileContent);
        fileContent = info.fileModifiedContent;
        var blockHeaders = fileContent.match(Patterns.blockHeaderRegex);
        console.log(blockHeaders)
        var fileAsBlocks = fileContent.split(Patterns.blockHeaderRegex)
        .filter(x=>x)
        .map((blockContent, i) => {
            if(i === 0)
                return [new Block(
                    "none",
                    "none",
                    blockContent
                )];
            i--;
            console.log(blockContent, i)
            var blockType = 'regular';
            blockType = blockHeaders[i].includes("prepend") ? "prepend" : blockType;
            blockType = blockHeaders[i].includes("append") ? "append" : blockType;
            var blocks = blockContent.split(Patterns.blockFooterRegex);
            if(blocks.length !== 2) {
                //throw somekind of error;
            }
            return [
                new Block(
                    blockType, 
                    blockHeaders[i]
                    .replace(Patterns.blockHeaderNameExtractRegex, "")
                    .replace(/ */g,""), 
                    blocks[0]
                ),
                new Block(
                    "none",
                    "none",
                    blocks[1]
                )
            ];
        })
        .reduce((prev, current) => {
            if(current instanceof Array)
                return [...prev, ...current];
            return [...prev, current];
        }, []);
        var blocksLevels = [fileAsBlocks];
        if(info.isExtending) {
            var extendedFileContent = fs.readFileSync(info.extendedFile, {encoding:'utf8', flag:'r'});
            blocksLevels = [...blocksLevels, ...this.ConvertToBlocks(extendedFileContent)];
        } 
        return blocksLevels;
    }

    static mergeBlocks(blocksLevels:Block[][]) {
        var superBlock = blocksLevels.pop();
        var newFileContent = superBlock.reduce((prev, current) => {
            var findLastBlockByNameAndType = (name, type, fallback?) => {
                var lastAccurOfBlock:Block;
                blocksLevels.reverse();
                blocksLevels.forEach((level) => {
                    level.forEach((block) => {
                        if(
                            block.name === name 
                            && block.type === type 
                            && type !== "none" 
                        ) {
                            lastAccurOfBlock = block;
                        }
                    });
                });
                return lastAccurOfBlock || fallback || '';
            }
            var fileContentUpTillNow = '';
            fileContentUpTillNow += (prev || '')
            if(current.type === "none") {
                return fileContentUpTillNow + current.content;
            } else {
                fileContentUpTillNow += findLastBlockByNameAndType(current.name, "prepend").content || '';
                fileContentUpTillNow += (findLastBlockByNameAndType(current.name, current.type) || current).content;
                fileContentUpTillNow += findLastBlockByNameAndType(current.name, "append").content || '';
            }
            return fileContentUpTillNow; 
        }, "");
        return newFileContent;
    }
    
}