import { BlockController } from './block';
import FileController from './file';
const loader = function (content:string) :string {
    const file = new FileController(this.resourcePath, content);
    const blockLevels = BlockController.ConvertToBlocks(file);
    const contentModified = BlockController.mergeBlocks(blockLevels);
    return contentModified;
}
export default loader;
module.exports = loader;