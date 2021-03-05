
interface fsMock {
  __setFileContent: (string) => void;
  readFileSync: (string) => string;
  
}
const fs:fsMock = jest.createMockFromModule('fs');


let fileContent = '';

function __setFileContent(content:string):void {
    fileContent = content;
}

function readFileSync():string {
  return fileContent
}

fs.__setFileContent = __setFileContent;
fs.readFileSync = readFileSync;

module.exports = fs;