
import * as path from 'path';
const fs = jest.createMockFromModule('fs') as any;


let fileContent = '';

function __setFileContent(content:string):void {
    fileContent = content;
}

function readFileSync(directoryPath):string {
  return fileContent
}

fs.__setFileContent = __setFileContent;
fs.readFileSync = readFileSync;

module.exports = fs;