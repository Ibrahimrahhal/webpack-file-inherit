import File from "../src/file";
import { basicFile, formatedExample } from './examples/example.files';
jest.mock('fs');
const fs = require('fs') as { __setFileContent: any };

describe("File Class", () => {
    describe("Creation", () => {
        test("Basic", () => {
            const file = new File("./file", "content");
            expect(file).not.toBeNull();
        });
        test("File Loading", () => {
            fs.__setFileContent(basicFile);
            const file = new File("./file");
            expect(file.content).toBe(basicFile);
        });
        test("Passing Content", () => {
            fs.__setFileContent(basicFile);
            const file = new File("./file", basicFile);
            expect(file.content).toBe(basicFile);
        });
    });

    describe("Formatting ", () => {
        test("Basic", () => {
            const file = new File("./file", basicFile);
            const formatted = file.formattedLineVisual("line 4", true, true);
            expect(formatted.trim()).toBe(formatedExample.trim());
        });

    });

    
});