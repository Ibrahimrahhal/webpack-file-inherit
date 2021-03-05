import { option } from 'yargs';
import * as fs from 'fs';
import loader from '../index';

const argv = option({
    inputFile: {
        describe: "Name of input file",
        alias: "file",
        string: true,
        demand: true
    },
    outputFile: {
        alias: "outfile",
        describe: "Name of output file",
        string: true,
        demand: true
    }
}).argv;
let fileContent = fs.readFileSync(argv.inputFile, {encoding:'utf8', flag:'r'});
let fileContentAfterModification = loader(fileContent);
fs.writeFileSync(argv.outputFile, fileContentAfterModification); 