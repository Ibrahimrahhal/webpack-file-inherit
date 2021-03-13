import { Patterns } from './../src/utils';
import { FileTwoLevelsBlocks, FileWithMultiBlock, FileWithOneBlock } from './examples/example-blocks';
import { Block, ExtendInfo, BlockController } from '../src/block';
import { FileExtendingExample, FileNotExtendingExample, FileMultiExtendingExample } from './examples/example-info';
import './__mocks__/fs';
jest.mock('fs');
import * as fs from 'fs';
import FileController from '../src/file';

describe("Block Class", () => {
    test("Creation", () => {
        const type = "Type-X",
            name = "Name-Y",
            content = "Content-Z";

        const block = new Block(type, name, content);
        expect(block.type).toBe(type);
        expect(block.name).toBe(name);
        expect(block.content).toBe(content);
    });
});

describe("File Info Class", () => {
    test("Creation", () => {
        const info = new ExtendInfo();
        expect(info.isExtending).toBe(false);
        expect(info.errors).toHaveLength(0);
        expect(info.fileModifiedContent).toBe('');
        expect(info.extendedFile).toBe('');
    });
});

describe("Blocks Controller", () => {
    describe("GetExtendingInfo", () => { 
        test("extending", () => {

            const info = BlockController.getExtendingInfo( { content: FileExtendingExample.content } as FileController);
            expect(info.isExtending).toBe(true);
            expect(info.errors).toHaveLength(0);
            expect(info.fileModifiedContent).toBe(FileExtendingExample.after);
            expect(info.extendedFile).toBe(FileExtendingExample.extending);
        });
        test("not extending", () => {
            const info = BlockController.getExtendingInfo({ content: FileNotExtendingExample.content } as FileController);
            expect(info.isExtending).toBe(false);
            expect(info.errors).toHaveLength(0);
            expect(info.fileModifiedContent).toBe(FileNotExtendingExample.content);
            expect(info.extendedFile).toBe('');
        });
        test("extend multiple files", () => {
            const extend = () => BlockController.getExtendingInfo({ content: FileMultiExtendingExample.content } as FileController);
            expect(extend).toThrowError();
        });
    });

    describe("ConvertToBlocks", () => { 
        test("one level & one block", () => {
            const blockLevels = BlockController.ConvertToBlocks({ content: FileWithOneBlock } as FileController);
            expect(blockLevels).toHaveLength(1);
            expect(blockLevels[0]).toHaveLength(3);
            expect(blockLevels[0].filter(block => block.type==="none")).toHaveLength(2);
        });
        test("one level & multipe blocks", () => {
            const blockLevels = BlockController.ConvertToBlocks({ content: FileWithMultiBlock } as FileController);
            expect(blockLevels).toHaveLength(1);
            expect(blockLevels[0]).toHaveLength(7);
            expect(blockLevels[0].filter(block => block.type==="none")).toHaveLength(4);
        });
        test("Two levels & multipe blocks", () => {
            (fs as any).__setFileContent(FileTwoLevelsBlocks.parent);
            const blockLevels = BlockController.ConvertToBlocks({ content: FileTwoLevelsBlocks.child } as FileController);
            expect(blockLevels).toHaveLength(2);
            expect(blockLevels[0]).toHaveLength(5);
            expect(blockLevels[0].filter(block => block.type==="none")).toHaveLength(3);
            expect(blockLevels[1]).toHaveLength(7);
            expect(blockLevels[1].filter(block => block.type==="none")).toHaveLength(4);
        });
    })
    describe("Merging Blocks", () => { 
        //to be done
    });

});

describe("Patterns Test", () => { 
    describe("Extend Expression Pattern Test", () => {
        test("Basic usage test ", () => {
            const example = "/* @extends 'file' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Usage with double quotes", () => {
            const example = "/* @extends \"file\" */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Usage without quotes", () => {
            const example = "/* @extends file */" ;
            expect(Patterns.extendRegex.test(example)).toBe(false);
        });
        test("Usage with wrong spelling", () => {
            const example = "/* @extend 'file' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(false);
        });
        test("Against file naming with hyphen", () => {
            const example = "/* @extends 'file-file' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file naming with underscore", () => {
            const example = "/* @extends 'file_file' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file naming not english", () => {
            const example = "/* @extends 'عربي' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file naming nested paths", () => {
            const example = "/* @extends 'folder/file.ext' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file naming nested paths more levels", () => {
            const example = "/* @extends 'folder/folder/file.ext' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file naming nested paths relative ", () => {
            const example = "/* @extends './folder/folder/file.ext' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file naming nested paths backwards ", () => {
            const example = "/* @extends '../../folder/folder/file.ext' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(true);
        });
        test("Against file with no name", () => {
            const example = "/* @extends '' */" ;
            expect(Patterns.extendRegex.test(example)).toBe(false);
        });
    })
    describe("Block Header Expression Pattern Test", () => {
        test("Basic Usage", () => {
            const example = "/* @block someblock */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(true);
        });
        test("Naming with hyphen", () => {
            const example = "/* @block some-block */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(true);
        });
        test("Naming with underscore", () => {
            const example = "/* @block some_block */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(true);
        });
        test("Naming with another lang", () => {
            const example = "/* @block عربي */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(true);
        });
        test("Adding prepend block", () => {
            const example = "/* @block prepend someblock */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(true);
        });
        test("Adding append block", () => {
            const example = "/* @block append someblock */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(true);
        });
        test("Empty name", () => {
            const example = "/* @block  */" ;
            expect(Patterns.blockHeaderRegex.test(example)).toBe(false);
        });
    
    });

    describe("Terminate Block Expression Pattern Test", () => {
        test("Basic Usage", () => {
            const example = "/* @terminate block */" ;
            expect(Patterns.blockFooterRegex.test(example)).toBe(true);
        });
        test("Wrong Spelling ", () => {
            const example = "/* @terminat block */" ;
            expect(Patterns.blockFooterRegex.test(example)).toBe(false);
        });
    });

});
