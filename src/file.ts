import * as fs from 'fs';
import * as chalk from 'chalk';

class Line {
    numbering:number;
    content:string;
    constructor(num:number, content:string) {
        this.numbering = num;
        this.content = content;
    }
}

class Lines extends Array<Line> {
    
    constructor(lines?: Line[]) {
        super();
        if(lines && lines instanceof Array) {
            lines.forEach(line => this.push(line));
        }
        Object.setPrototypeOf(this, Object.create(Lines.prototype));
    }

    getContent(): string {
        return this.map(line => line.content).join("\n");
    }
    findLines(lineContent:string): Lines {
        return new Lines(this.filter(line => line.content.includes(lineContent)));
    }
    findLine(num:number): Line | undefined {
        return this[num-1];
    }
    getBlockAroundLine(lineNumber: number, blockSize: number) :Lines {
        if(blockSize % 2 !== 1) {
            throw new Error("Block Size Must Be ")
        }
        if(lineNumber < 1) {
            throw new Error("Invalid Line Number");
        }
        blockSize = Math.ceil(blockSize / 2);
        let startPoint = lineNumber - blockSize;
        let endPoint = lineNumber + blockSize;
        let block = new Lines();
        for(let i = startPoint; i <= endPoint; i++) {
            let line = this.findLine(i) || new Line(undefined, "");
            if(line) {
                block.push(line);
            }
        }
        return block;
    }

}

export default class FileController {

    private _path:string;
    private _content:Lines;
    constructor(path:string, content?:string) {
        this._path = path;
        let fileContent = content;
        if(!content) fileContent =  fs.readFileSync(this._path, { encoding:'utf8', flag:'r' });
        this._content = new Lines(fileContent.split("\n").map((line, index) => new Line(index+1, line)));
    }
    get content(): string {
        return this._content.getContent();
    }

    formattedLineVisual(lineContent, last = true, disableColor = false): string {
        let lines = this._content.findLines(lineContent);
        if(last) {
            lines.reverse();
        }
        let line = lines[0];
        let block = this._content.getBlockAroundLine(line.numbering, 5);
        let formratedString = block.reduce((prev, curr) => {
            let isSelectedLine = curr.numbering === line.numbering;
            let formatted = `${prev}${isSelectedLine ? '> ' : '  '} ${curr.numbering ? curr.numbering + ')' : ' '} ${curr.content}\n`;
            return  isSelectedLine ? !disableColor ? chalk.red(formatted) : formatted : !disableColor ? chalk.white(formatted) : formatted;
        }, '\n');
        return formratedString;
    }
}