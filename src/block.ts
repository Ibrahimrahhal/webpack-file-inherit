import { Patterns } from './utils';
import { MultiExtendError, MultiTerminateError, throwDescriptiveError } from './errors';
import FileController from './file';
import * as path from 'path';

export class Block {
    type:string;
    name:string;
    content:string;
    constructor(t:string, n:string, c:string) {
        this.type = t;
        this.name = n;
        this.content = c;
    }
}
export class ExtendInfo {
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

    static getExtendingInfo(file: FileController): ExtendInfo {
        const extendingInfo = new ExtendInfo();
        const fileContent = file.content;
        if(!Patterns.extendRegex.test(fileContent)) {
            extendingInfo.isExtending = false;
            extendingInfo.fileModifiedContent = fileContent;
            return extendingInfo;
        }
        const extendDirectives = fileContent.match(Patterns.extendRegex);
    
        if(extendDirectives.length > 1) {
            throwDescriptiveError(MultiExtendError, file, extendDirectives.reverse()[0]);
        }
    
        extendingInfo.isExtending = true;
        extendingInfo.fileModifiedContent = fileContent.replace(Patterns.extendRegex, "");
        extendingInfo.extendedFile = extendDirectives[0].replace(/@extends +/g, "").replace(/('|"| )/g, "");
        if(!path.isAbsolute(extendingInfo.extendedFile)) {
            extendingInfo.extendedFile = path.join(file.path, '../', extendingInfo.extendedFile);
        }
        return extendingInfo;
    }

    static ConvertToBlocks(file:FileController):Block[][] {
        const info = this.getExtendingInfo(file);
        const fileContent = info.fileModifiedContent;
        const blockHeaders = fileContent.match(Patterns.blockHeaderRegex);
        const fileAsBlocks = fileContent.split(Patterns.blockHeaderRegex)
            .filter(x=>x)
            .map((blockContent, i) => {
                if(i === 0)
                    return [new Block(
                        "none",
                        "none",
                        blockContent
                    )];
                i--;
                let blockType = 'regular';
                blockType = blockHeaders[i].includes("prepend") ? "prepend" : blockType;
                blockType = blockHeaders[i].includes("append") ? "append" : blockType;
                const blocks = blockContent.split(Patterns.blockFooterRegex);
                if(blocks.length !== 2) {
                    throwDescriptiveError(MultiTerminateError, file, blocks.reverse()[0]);
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
        let blocksLevels = [fileAsBlocks];
        if(info.isExtending) {
            const extendedFile = new FileController(info.extendedFile);
            blocksLevels = [...blocksLevels, ...this.ConvertToBlocks(extendedFile)];
        } 
        return blocksLevels;
    }

    static mergeBlocks(blocksLevels:Block[][]): string {
        const superBlock = blocksLevels.pop();
        const newFileContent = superBlock.reduce((prev, current) => {
            const findLastBlockByNameAndType = (name, type, fallback?) => {
                let lastAccurOfBlock:Block;
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
            let fileContentUpTillNow = '';
            fileContentUpTillNow += prev || '';
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