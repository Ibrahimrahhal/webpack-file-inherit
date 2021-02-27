import { FileWithMultiBlock, FileWithOneBlock } from './examples/example-blocks';
import { Block, ExtendInfo, BlockController } from '../src/block';
import { FileExtendingExample, FileNotExtendingExample, FileMultiExtendingExample } from './examples/example-info';

describe("Block Class", () => {
    test("Creation", () => {
        var type = "Type-X",
            name = "Name-Y",
            content = "Content-Z";

        var block = new Block(type, name, content);
        expect(block.type).toBe(type);
        expect(block.name).toBe(name);
        expect(block.content).toBe(content);
    });
});

describe("File Info Class", () => {
    test("Creation", () => {
        var info = new ExtendInfo();
        expect(info.isExtending).toBe(false);
        expect(info.errors).toHaveLength(0);
        expect(info.fileModifiedContent).toBe('');
        expect(info.extendedFile).toBe('');
    });
});

describe("Blocks Controller", () => {
    describe("GetExtendingInfo", () => { 
        test("extending", () => {
            var info = BlockController.getExtendingInfo(FileExtendingExample.content);
            expect(info.isExtending).toBe(true);
            expect(info.errors).toHaveLength(0);
            expect(info.fileModifiedContent).toBe(FileExtendingExample.after);
            expect(info.extendedFile).toBe(FileExtendingExample.extending);
        });
        test("not extending", () => {
            var info = BlockController.getExtendingInfo(FileNotExtendingExample.content);
            expect(info.isExtending).toBe(false);
            expect(info.errors).toHaveLength(0);
            expect(info.fileModifiedContent).toBe(FileNotExtendingExample.content);
            expect(info.extendedFile).toBe('');
        });
        test("extend multiple files", () => {
            var extend = () => BlockController.getExtendingInfo(FileMultiExtendingExample.content);
            expect(extend).toThrowError();
        });
    });

    describe("ConvertToBlocks", () => { 
        test("Basic with one level & one block", () => {
            var blockLevels = BlockController.ConvertToBlocks(FileWithOneBlock);
            expect(blockLevels).toHaveLength(1);
            expect(blockLevels[0]).toHaveLength(3);
            expect(blockLevels[0].filter(block => block.type==="none")).toHaveLength(2);
        });
        test("Basic with one level & multipe blocks", () => {
            var blockLevels = BlockController.ConvertToBlocks(FileWithMultiBlock);
            expect(blockLevels).toHaveLength(1);
            expect(blockLevels[0]).toHaveLength(7);
            expect(blockLevels[0].filter(block => block.type==="none")).toHaveLength(4);
        });
    })

});